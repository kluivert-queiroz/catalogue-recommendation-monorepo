import { Injectable, OnModuleInit } from '@nestjs/common';
import { Watchlist } from '../models/watchlist.model';
import { mapping } from 'cassandra-driver';
import { WatchlistEntity } from './entities/watchlist.entity';
import {
  CassandraService,
  ShowsService,
} from '@catalogue-recommendation-monorepo/shared';

@Injectable()
export class WatchlistRepository implements OnModuleInit {
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly showsService: ShowsService
  ) {}

  mapper!: mapping.Mapper;
  watchlistMapper!: mapping.ModelMapper<WatchlistEntity>;
  onModuleInit() {
    const mappingOptions: mapping.MappingOptions = {
      models: {
        WatchlistEntity: {
          tables: ['watchlist'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };
    this.mapper = this.cassandraService.createMapper(mappingOptions);
    this.watchlistMapper = this.cassandraService
      .createMapper(mappingOptions)
      .forModel('WatchlistEntity');
  }
  async findByUserId(userId: string): Promise<Watchlist> {
    const defaultWatchlist = new Watchlist({ userId, shows: [] });
    const result = await this.watchlistMapper.find({ userId });
    if (result.toArray().length === 0) {
      return defaultWatchlist;
    }
    return this.entitiesToModel(result.toArray());
  }
  async save(watchlist: Watchlist): Promise<void> {
    const entities: WatchlistEntity[] = watchlist.shows.map((show) => ({
      userId: watchlist.userId,
      showId: show.id,
      createdAt: new Date(),
    }));
    const changes = entities.map((entity) =>
      this.watchlistMapper.batching.insert(entity)
    );

    await this.mapper.batch(changes).catch((err) => {
      console.error('Error saving watchlist:', err);
    });
  }
  private async entitiesToModel(
    entities: WatchlistEntity[]
  ): Promise<Watchlist> {
    const shows = await Promise.all(
      entities.map(async (entity) => {
        const show = await this.showsService.getShowById(entity.showId);
        return show!;
      })
    );
    return new Watchlist({
      userId: entities[0].userId,
      shows,
    });
  }
}
