import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { WatchlistRepository } from './repositories/watchlist.repository';
import { EventHandlers } from './events/handlers';
import {
  CassandraModule,
  EmbeddingModule,
  ShowsModule,
} from '@catalogue-recommendation-monorepo/shared';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ShowsModule,
    CassandraModule,
    EmbeddingModule,
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'watchlist',
          type: 'topic',
        },
      ],
      queues: [
        {
          routingKey: 'watched-show',
          name: 'watched-shows-queue',
          exchange: 'watchlist',
        },
      ],
      uri: process.env.MQ_URL!,
    }),
  ],
  controllers: [WatchlistController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
    WatchlistRepository,
  ],
})
export class WatchlistModule {}
