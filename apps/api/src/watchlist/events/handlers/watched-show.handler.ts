import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WatchedShowEvent } from '@catalogue-recommendation-monorepo/shared';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@EventsHandler(WatchedShowEvent)
export class WatchedShowEventHandler
  implements IEventHandler<WatchedShowEvent>
{
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async handle(event: WatchedShowEvent) {
    try {
      await this.amqpConnection.publish('watchlist', 'watched-show', event);
    } catch (error) {
      console.error('Error handling WatchedShowEvent:', error);
    }
  }
}
