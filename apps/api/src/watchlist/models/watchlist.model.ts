import { AggregateRoot } from '@nestjs/cqrs';
import { WatchedShowEvent } from '../events/watched-show.event';
import { ShowEntity } from '../../shows/repositories/entities/show.entity';

interface WatchlistProps {
  userId: string;
  shows: ShowEntity[];
}
export class Watchlist extends AggregateRoot {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  shows: ShowEntity[] = [];
  userId: string;

  constructor(properties: WatchlistProps) {
    super();
    // Object.assign(this, properties);
    this.userId = properties.userId;
    this.shows = properties.shows;
  }
  watchShow(show: ShowEntity) {
    // if (!this.shows.find(({ id }) => id === show.id)) {
      this.shows.push(show);
      this.apply(new WatchedShowEvent(this.userId, show));
    // }
  }
}
