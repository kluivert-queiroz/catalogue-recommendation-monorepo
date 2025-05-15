import { Module } from '@nestjs/common';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  QdrantModule,
  CassandraService,
  ShowEntity,
  ShowsModule,
  EmbeddingModule,
  RecommendationsModule,
} from '@catalogue-recommendation-monorepo/shared';
import { ShowsIndexerService } from '../shows/services/shows-indexer.service';

@Module({
  imports: [
    WatchlistModule,
    ShowsModule,
    EmbeddingModule,
    ConfigModule.forRoot(),
    QdrantModule,
    RecommendationsModule,
  ],
  providers: [CassandraService, ShowsIndexerService],
})
export class AppModule {}
