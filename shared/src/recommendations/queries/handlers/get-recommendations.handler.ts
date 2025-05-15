import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRecommendationsQuery } from '../get-recommendations.query';
import { Recommendation } from '../../../recommendations/models';
import { RecommendationsRepository } from '../../../recommendations/repositories';

@QueryHandler(GetRecommendationsQuery)
export class GetRecommendationsHandler
  implements IQueryHandler<GetRecommendationsQuery>
{
  constructor(
    private readonly recommendationsRepository: RecommendationsRepository
  ) {}
  execute(query: GetRecommendationsQuery): Promise<Recommendation[]> {
    return this.recommendationsRepository.findByUserId(query.userId);
  }
}
