import { Module } from '@nestjs/common';
import { WatchlistModule } from '../watchlist/watchlist.module';
import { ConfigModule } from '@nestjs/config';
import {
  QdrantModule,
  CassandraService,
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
