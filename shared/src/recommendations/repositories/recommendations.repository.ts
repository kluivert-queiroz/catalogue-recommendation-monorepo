import { Injectable, OnModuleInit } from '@nestjs/common';
import { mapping } from 'cassandra-driver';
import { RecommendationEntity } from './entities/recommendation.entity';
import { CassandraService } from '../../lib/cassandra';
import { Recommendation } from '../models';
import { unionBy } from 'lodash';
@Injectable()
export class RecommendationsRepository implements OnModuleInit {
  constructor(private readonly cassandraService: CassandraService) {}

  mapper!: mapping.Mapper;
  recommendationsMapper!: mapping.ModelMapper<RecommendationEntity>;
  onModuleInit() {
    const mappingOptions: mapping.MappingOptions = {
      models: {
        RecommendationEntity: {
          tables: ['recommendations'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };
    this.mapper = this.cassandraService.createMapper(mappingOptions);
    this.recommendationsMapper = this.cassandraService
      .createMapper(mappingOptions)
      .forModel('RecommendationEntity');
  }
  async save(recommendation: Recommendation): Promise<void> {
    const entities: RecommendationEntity[] = recommendation.genres
      .split(', ')
      .map((genre) => ({
        userId: recommendation.userId,
        showId: recommendation.showId,
        genre,
        name: recommendation.name,
        popularity: recommendation.popularity,
        releaseYear: recommendation.releaseYear,
        voteAverage: recommendation.voteAverage,
        score: recommendation.score,
        created_at: new Date(),
      }));
    const changes = entities.map((entity) =>
      this.recommendationsMapper.batching.insert(entity)
    );

    await this.mapper.batch(changes).catch((err) => {
      console.error('Error saving recommendations:', err);
    });
  }
  async findByUserId(
    userId: string,
    { limit = 10 }: { limit?: number } = {}
  ): Promise<Recommendation[]> {
    const entities = await this.recommendationsMapper.find(
      { userId },
      { limit }
    );
    return this.entitiesToModel(entities.toArray());
  }

  private entitiesToModel(entities: RecommendationEntity[]): Recommendation[] {
    const showGenresMap = new Map<number, string[]>();
    entities.forEach((e) => {
      if (!showGenresMap.has(e.showId)) {
        showGenresMap.set(e.showId, []);
      }
      showGenresMap.get(e.showId)?.push(e.genre);
    });
    return unionBy(entities, 'showId').map(
      (e) =>
        new Recommendation({
          showId: e.showId,
          name: e.name,
          popularity: e.popularity,
          releaseYear: e.releaseYear,
          userId: e.userId,
          voteAverage: e.voteAverage,
          genres: showGenresMap.get(e.showId)?.join(', ') || '',
          score: e.score,
        })
    );
  }
}
