import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ShowEntity } from '../repositories/entities/show.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QdrantService } from '../../common/qdrant/qdrant.service';
import { EmbeddingService } from '../../embedding/embedding.service';
import { ReadStream } from 'fs';
import { ShowModel } from '../models/show.model';

@Injectable()
export class ShowsService {
  constructor(
    @InjectRepository(ShowEntity)
    private readonly showsRepository: Repository<ShowEntity>,
    private readonly qdrantService: QdrantService,
    private readonly embeddingService: EmbeddingService,
    private readonly dataSource: DataSource
  ) {}

  async getShow(showId: string) {
    // Simulate fetching show details from a database or external API
    return this.showsRepository.findOneBy({ id: showId });
  }

  async getAllShows() {
    return this.showsRepository.find();
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
    const results = await this.qdrantService.search('shows', embedding, 10);
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

  async getRecommendations(showId: string) {
    const show = (await this.getShow(showId))?.toModel();
    if (!show) {
      throw new Error('Show not found');
    }
    const embedding = await this.embeddingService.generateEmbedding(
      show.getEmbeddingString()
    );
    const minimumDate = show.lastAirDate ?? new Date();
    const minimumYear = minimumDate.getFullYear() - 7;
    const results = await this.qdrantService.search('shows', embedding, {
      limit: 30,
      filter: {
        must: [
          { key: 'voteCount', range: { gte: 200 } },
          {
            key: 'releaseYear',
            range: { gte: minimumYear },
          },
        ],
      },
    });
    return results;
  }
}
