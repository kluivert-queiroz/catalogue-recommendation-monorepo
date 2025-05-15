import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { WatchShowCommand } from '../watch-show.command';
import { WatchlistRepository } from '../../repositories/watchlist.repository';
import {
  ShowNotFoundException,
  ShowsService,
} from '@catalogue-recommendation-monorepo/shared';

@CommandHandler(WatchShowCommand)
export class WatchShowHandler implements ICommandHandler<WatchShowCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly watchlistRepository: WatchlistRepository,
    private readonly showsService: ShowsService
  ) {}
  async execute(command: WatchShowCommand) {
    const { userId, showId } = command;
    const watchlist = this.publisher.mergeObjectContext(
      await this.watchlistRepository.findByUserId(userId)
    );
    const show = await this.showsService.getShowById(showId);
    if (!show) {
      throw new ShowNotFoundException(showId);
    }
    watchlist.watchShow(show);
    watchlist.commit();
    await this.watchlistRepository.save(watchlist);
  }
}
