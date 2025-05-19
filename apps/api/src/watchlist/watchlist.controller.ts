import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { WatchShowDto } from './interfaces/watch-show.dto';
import { WatchShowCommand } from './commands/watch-show.command';
import { GetWatchlistQuery } from './queries/get-watchlist.query';
import { ApiQuery } from '@nestjs/swagger';

@Controller('watchlist')
export class WatchlistController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

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
  @ApiQuery({
    name: 'pageState',
    required: false,
  })
  getWatchlist(
    @Param('userId') userId: string,
    @Query('pageState') pageState?: string
  ) {
    return this.queryBus.execute(new GetWatchlistQuery(userId, pageState));
  }
}
