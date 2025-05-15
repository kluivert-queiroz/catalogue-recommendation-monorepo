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
import { GetRecommendationsQuery } from './queries/get-recommendations.query';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get(':userId')
  async getRecommendations(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetRecommendationsQuery(userId));
  }
}
