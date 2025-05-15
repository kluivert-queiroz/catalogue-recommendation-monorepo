import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { WatchShowDto } from './interfaces/watch-show.dto';
import { WatchShowCommand } from './commands/watch-show.command';
import { GetWatchlistQuery } from './queries/get-watchlist.query';
import { ShowsService } from '@catalogue-recommendation-monorepo/shared';
@Controller('watchlist')
export class WatchlistController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private readonly showsService: ShowsService
  ) {}

  @Post(':userId/watch-movie')
  async watchMovie(
    @Param('userId') userId: string,
    @Body() watchShow: WatchShowDto
  ) {
    const { showId: movieId } = watchShow;
    return this.commandBus.execute(new WatchShowCommand(userId, movieId));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':userId')
  getWatchlist(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetWatchlistQuery(userId));
  }
}
