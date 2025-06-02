import { Injectable } from '@nestjs/common';
import { DataSource, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReadStream } from 'fs';
import { ShowEntity, ShowQdrantPayload } from '../entities';
import { QdrantService } from '../../lib/qdrant';
import { EmbeddingService } from '../../lib/embedding';
import { ShowModel } from '../models';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Paginated } from 'src/lib/postgres';
import { GetShowsDto } from '../interfaces/get-shows.dto';
import { IndexedState } from '../entities/show.entity';

type QdrantSearchResponse = (Awaited<ReturnType<QdrantClient['search']>>[0] & {
  payload: ShowQdrantPayload;
})[];

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(ShowEntity)
    private readonly showsRepository: Repository<ShowEntity>,
    private readonly qdrantService: QdrantService,
    private readonly embeddingService: EmbeddingService,
    private readonly dataSource: DataSource
  ) {}

  async getShowById(showId: number): Promise<ShowModel | null> {
    const entity = await this.showsRepository.findOneBy({ id: showId });
    return entity?.toModel() || null;
  }

  async getAllShows() {
    return this.showsRepository.find();
  }
  async findShowsPaginated({
    take = 10,
    skip,
    search,
  }: {
    take?: number;
    skip?: number;
    search: Omit<GetShowsDto, 'skip' | 'take'>;
  }): Promise<Paginated<ShowModel>> {
    const [data, count] = await this.showsRepository.findAndCount({
      take,
      skip,
      where: {
        name: search.name && Like(`%${search.name}%`),
        genres: search.genres && Like(`%${search.genres}%`),
        voteAverage: search.voteAverage && MoreThanOrEqual(search.voteAverage),
      },
    });
    return { data: data.map((e) => e.toModel()), count };
  }

  /**
   * Clears the indexing state of all shows that was updated more than 1 minutes ago.
   * This is useful for resetting the indexing state of shows that might have been
   * stuck in the indexing process or were not indexed correctly.
   * It will set the `indexed_state` to `NOT_INDEXED` for all shows that were updated
   * more than 1 minutes ago.
   */
  async clearIndexingState() {
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
    const { affected } = await this.showsRepository
      .createQueryBuilder()
      .update(ShowEntity)
      .set({ indexedState: IndexedState.NOT_INDEXED })
      .where('indexedState = :state AND updatedAt < :time', {
        state: IndexedState.INDEXING,
        time: oneMinuteAgo,
      })
      .execute();
    console.log(
      `[Indexing] Cleared indexing state for shows updated 
      before ${oneMinuteAgo.toISOString()}. Affected rows: ${affected}`
    );
  }

  async getReadyShowsForIndexing(
    { take }: { take?: number } = { take: 1000 }
  ): Promise<{ results: ShowModel[]; count: number }> {
    return await this.dataSource.transaction(async (manager) => {
      const count = await this.showsRepository.count({
        where: { indexedState: IndexedState.NOT_INDEXED },
      });

      const entities = await manager
        .getRepository(ShowEntity)
        .createQueryBuilder('show')
        .where('show.indexedState = :state', {
          state: IndexedState.NOT_INDEXED,
        })
        .limit(take)
        .setLock('pessimistic_write')
        .setOnLocked("skip_locked")
        .getMany();

      if (entities.length > 0) {
        await manager
          .getRepository(ShowEntity)
          .createQueryBuilder()
          .update()
          .set({ indexedState: IndexedState.INDEXING })
          .whereInIds(entities.map((e) => e.id))
          .execute();
      }
      
      return {
        results: entities.map((e) => e.toModel()),
        count
      };
    });
  }

  async getAllShowsStream(): Promise<ReadStream> {
    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(
        this.showsRepository.metadata.tableName,
        this.showsRepository.metadata.tableName
      )
      .stream();
  }

  async search(query: string) {
    const embedding = await this.embeddingService.generateEmbedding(query);
    const results = await this.qdrantService.search('shows', embedding, {
      limit: 10,
    });
    return results;
  }
  async markShowsAsIndexing(shows: ShowModel[]) {
    const showIds = shows.map((show) => show.id);
    await this.showsRepository
      .createQueryBuilder()
      .update(ShowEntity)
      .set({ indexedState: IndexedState.INDEXING })
      .where('id IN (:...showIds)', { showIds })
      .execute();
  }
  async markShowsAsIndexed(shows: ShowModel[]) {
    const showIds = shows.map((show) => show.id);
    await this.showsRepository
      .createQueryBuilder()
      .update(ShowEntity)
      .set({ indexedState: IndexedState.INDEXED })
      .where('id IN (:...showIds)', { showIds })
      .execute();
  }

  async getRecommendations(showId: number): Promise<QdrantSearchResponse> {
    const show = await this.getShowById(showId);
    if (!show) {
      throw new Error('Show not found');
    }
    const embedding = await this.embeddingService.generateEmbedding(
      show.getEmbeddingString()
    );
    const minimumDate = show.lastAirDate ?? new Date();
    const minimumYear = minimumDate.getFullYear() - 7;
    const results = (await this.qdrantService.search('shows', embedding, {
      limit: 30,
      filter: {
        // @ts-expect-error Type error
        must: [
          { key: 'voteCount', range: { gte: 200 } },
          {
            key: 'releaseYear',
            range: { gte: minimumYear },
          },
        ],
      },
    })) as QdrantSearchResponse;
    // We don't wanna recommend already watched shows.
    return results.filter(({ id }) => id !== showId);
  }
}
