import { Module } from '@nestjs/common';
import { RecommendationsRepository } from './repositories/recommendations.repository';
import { CassandraModule } from '../lib/cassandra';
import { RecommendationsController } from './recommendations.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries/handlers';

@Module({
  imports: [CassandraModule, CqrsModule],
  providers: [RecommendationsRepository, ...QueryHandlers],
  exports: [RecommendationsRepository],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
