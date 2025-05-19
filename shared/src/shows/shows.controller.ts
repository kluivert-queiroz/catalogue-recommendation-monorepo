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
import { QueryBus } from '@nestjs/cqrs';
import { GetShowsQuery } from './queries/get-shows.query';
import { GetShowsDto } from './interfaces/get-shows.dto';

@Controller('shows')
export class ShowsController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get('/')
  findAll(@Query() query: GetShowsDto) {
    return this.queryBus.execute(new GetShowsQuery(query));
  }
}
