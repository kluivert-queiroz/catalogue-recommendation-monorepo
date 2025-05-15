import { AggregateRoot } from '@nestjs/cqrs';

interface RecommendationProps {
  userId: string;
  showId: number;
  name: string;
  genres: string;
  releaseYear: number;
  voteAverage: number;
  popularity: number;
  score: number;
}

export class Recommendation extends AggregateRoot {
  userId!: string;
  showId!: number;
  name!: string;
  genres!: string;
  releaseYear!: number;
  voteAverage!: number;
  popularity!: number;
  score!: number;
  constructor(props: RecommendationProps) {
    super();
    Object.assign(this, props);
  }
}
