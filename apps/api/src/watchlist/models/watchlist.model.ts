import { AggregateRoot } from '@nestjs/cqrs';
import {
  ShowEntity,
  ShowModel,
  WatchedShowEvent,
} from '@catalogue-recommendation-monorepo/shared';
interface WatchlistProps {
  userId: string;
  shows: ShowModel[];
}
export class Watchlist extends AggregateRoot {
  shows: ShowModel[] = [];
  userId!: string;

  constructor(properties: WatchlistProps) {
    super();
    Object.assign(this, properties);
  }
  watchShow(show: ShowModel) {
    // if (!this.shows.find(({ id }) => id === show.id)) {
    this.shows.push(show);
    this.apply(new WatchedShowEvent(this.userId, show));
    // }
  }
}
