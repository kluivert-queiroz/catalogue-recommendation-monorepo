import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WatchedShowEvent } from '../watched-show.event';
import { ClientProxy, RmqStatus } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@EventsHandler(WatchedShowEvent)
export class WatchedShowEventHandler
  implements IEventHandler<WatchedShowEvent>
{
  constructor(@Inject('WATCHLIST_SERVICE') private client: ClientProxy) {}

  async handle(event: WatchedShowEvent) {
    try {
      this.client.emit('watched_show', event);
    } catch (error) {
      console.error('Error handling WatchedShowEvent:', error);
    }
  }
}
