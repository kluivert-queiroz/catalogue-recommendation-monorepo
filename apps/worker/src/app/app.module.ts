import { Module } from '@nestjs/common';
import { RecommendationsModuleWorker } from '../recommendations-worker/recommendations-worker.module';
import { ShowsModule } from '@catalogue-recommendation-monorepo/shared';

@Module({
  imports: [RecommendationsModuleWorker, ShowsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
