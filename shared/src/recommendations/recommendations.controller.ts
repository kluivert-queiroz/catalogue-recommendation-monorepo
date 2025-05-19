import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetRecommendationsQuery } from './queries/get-recommendations.query';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Recommendation } from './models';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({
    description: `This request will return recommendations for given user. 
    Users mut have at least one show in its watchlist before any recommendation.`,
  })
  @ApiResponse({
    status: 200,
    type: Recommendation,
    isArray: true,
  })
  @Get(':userId')
  async getRecommendations(
    @Param('userId') userId: string
  ): Promise<Recommendation[]> {
    return this.queryBus.execute(new GetRecommendationsQuery(userId));
  }
}
