import { TestBed, Mocked } from '@suites/unit';

import { WatchShowHandler } from './watch-show.handler';
import { WatchShowCommand } from '../watch-show.command';
import { EventPublisher } from '@nestjs/cqrs';
import { WatchlistRepository } from '../../repositories/watchlist.repository';
import {
  ShowModel,
  ShowsService,
} from '@catalogue-recommendation-monorepo/shared';
import { Watchlist } from '../../models/watchlist.model';

describe('Watch Show Command Handler', () => {
  let watchShowCommandHandler: WatchShowHandler;
  let eventPublisher: Mocked<EventPublisher>;
  let watchlistRepository: Mocked<WatchlistRepository>;
  let showsService: Mocked<ShowsService>;

  const mockWatchlist = () =>
    ({
      watchShow: jest.fn(),
      commit: jest.fn(),
    } as unknown as Watchlist);

  beforeAll(async () => {
    const { unit, unitRef } = await TestBed.solitary(
      WatchShowHandler
    ).compile();
    watchShowCommandHandler = unit;
    eventPublisher = unitRef.get(EventPublisher);
    watchlistRepository = unitRef.get(WatchlistRepository);
    showsService = unitRef.get(ShowsService);
    eventPublisher.mergeObjectContext.mockImplementation((r) => r);
  });

  it('should handle watched show events correctly', async () => {
    const watchlist = mockWatchlist();
    watchlistRepository.findPaginatedByUserId.mockResolvedValue(watchlist);
    showsService.getShowById.mockResolvedValue({ id: 1 } as ShowModel);

    const command = new WatchShowCommand('userId', 1);

    await watchShowCommandHandler.execute(command);
    expect(watchlist.watchShow).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 })
    );
    expect(watchlist.commit).toHaveBeenCalled();
    expect(watchlistRepository.save).toHaveBeenCalledWith(watchlist);
  });
  it('should handle not found show', async () => {
    const watchlist = mockWatchlist();
    watchlistRepository.findPaginatedByUserId.mockResolvedValue(watchlist);
    showsService.getShowById.mockResolvedValue(null);

    const command = new WatchShowCommand('userId', 1);
    await expect(
      watchShowCommandHandler.execute(command)
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Show ID 1 not found"`);
		expect(watchlistRepository.save).not.toHaveBeenCalledWith(watchlist);
  });
});
