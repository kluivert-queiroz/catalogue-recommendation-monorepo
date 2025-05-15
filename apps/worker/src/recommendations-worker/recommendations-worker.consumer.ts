import { RabbitPayload, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { WatchedShowEvent } from '@catalogue-recommendation-monorepo/shared';
import { CommandBus } from '@nestjs/cqrs';
import { RecommendMoreShowsCommand } from './commands/recommend-more-shows.command';
@Injectable()
export class RecommendationsConsumer {
  constructor(private readonly commandBus: CommandBus) {}

  @RabbitRPC({
    exchange: 'watchlist',
    routingKey: 'watched-show',
    queue: 'watched-shows-queue',
  })
  handleWatchedShow(@RabbitPayload() data: WatchedShowEvent) {
    return this.commandBus.execute(
      new RecommendMoreShowsCommand(data.userId, data.show.id)
    );
  }
}
