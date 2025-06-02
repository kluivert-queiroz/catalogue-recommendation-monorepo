import { Module } from '@nestjs/common';
import { RecommendationsModuleWorker } from '../recommendations-worker/recommendations-worker.module';
import { ShowsModule, ShowsIndexerService, QdrantModule } from '@catalogue-recommendation-monorepo/shared';

@Module({
  imports: [RecommendationsModuleWorker, ShowsModule, QdrantModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
