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

  async getAllNotIndexedShows() {
    return (await this.showsRepository.findBy({ indexed: false })).map((s) =>
      s.toModel()
    );
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
  async markShowsAsIndexed(shows: ShowModel[]) {
    const showIds = shows.map((show) => show.id);
    await this.showsRepository
      .createQueryBuilder()
      .update(ShowEntity)
      .set({ indexed: true })
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
