import { Query } from '@nestjs/cqrs';
import { Watchlist } from '../models/watchlist.model';

export class GetWatchlistQuery extends Query<Watchlist | null> {
  constructor(public readonly userId: string) {
    super();
  }
}
