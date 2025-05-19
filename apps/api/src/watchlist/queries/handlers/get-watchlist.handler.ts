import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWatchlistQuery } from '../get-watchlist.query';
import { WatchlistRepository } from '../../repositories/watchlist.repository';
import { Watchlist } from '../../models/watchlist.model';

@QueryHandler(GetWatchlistQuery)
export class GetWatchlistHandler implements IQueryHandler<GetWatchlistQuery> {
  constructor(private readonly watchlistRepository: WatchlistRepository) {}

  async execute(query: GetWatchlistQuery): Promise<Watchlist | null> {
    const watchlist = await this.watchlistRepository.findPaginatedByUserId(
      query.userId,
      { fetchSize: 10, pageState: query.pageState }
    );
    return watchlist;
  }
}
