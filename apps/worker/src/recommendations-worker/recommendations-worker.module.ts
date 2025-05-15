import { Module } from '@nestjs/common';
import { RecommendationsConsumer } from './recommendations-worker.consumer';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  RecommendationsModule,
  ShowsModule,
} from '@catalogue-recommendation-monorepo/shared';
import { CommandHandlers } from './commands/handlers';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'watchlist',
          type: 'topic',
        },
      ],
      queues: [
        {
          exchange: 'watchlist',
          routingKey: 'watched-show',
          name: 'watched-shows-queue',
        },
      ],
      uri: process.env.MQ_URL!,
      connectionInitOptions: { wait: true },
    }),
    RecommendationsModule,
    ShowsModule,
    CqrsModule,
  ],
  providers: [RecommendationsConsumer, ...CommandHandlers],
  exports: [RecommendationsConsumer],
})
export class RecommendationsModuleWorker {}
