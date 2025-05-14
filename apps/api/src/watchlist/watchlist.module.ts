import { Module } from '@nestjs/common';
import { WatchlistController } from './watchlist.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands/handlers';
import { QueryHandlers } from './queries/handlers';
import { WatchlistRepository } from './repositories/watchlist.repository';
import { ShowsModule } from '../shows/shows.module';
import { CassandraModule } from '../common/cassandra/cassandra.module';
import { EmbeddingModule } from '../embedding/embedding.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventHandlers } from './events/handlers';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ShowsModule,
    CassandraModule,
    EmbeddingModule,
    ClientsModule.register([
      {
        name: 'WATCHLIST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.MQ_URL!],
          queue: 'watched_shows_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
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
