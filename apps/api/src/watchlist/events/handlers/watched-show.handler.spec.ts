import { TestBed, Mocked } from '@suites/unit';
import { WatchedShowEventHandler } from './watched-show.handler';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { WatchedShowEvent } from '@catalogue-recommendation-monorepo/shared';

describe('Watched Show Event Handler', () => {
	let watchedShowEventHandler: WatchedShowEventHandler;
	let amqpConnection: Mocked<AmqpConnection>
	
	beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(WatchedShowEventHandler).compile();
    watchedShowEventHandler = unit;
    amqpConnection = unitRef.get(AmqpConnection);
  });

  it('should handle watched show events correctly', async () => {
    const event = new WatchedShowEvent('userId', 1);
    await watchedShowEventHandler.handle(event);
    expect(amqpConnection.publish).toHaveBeenCalledWith(
      'watchlist',
      'watched-show',
      event.showId
    );
  });
});
