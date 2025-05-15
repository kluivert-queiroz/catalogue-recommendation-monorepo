import { Query } from '@nestjs/cqrs';
import { Recommendation } from '../models';

export class GetRecommendationsQuery extends Query<Recommendation[]> {
  constructor(public readonly userId: string) {
    super();
  }
}
