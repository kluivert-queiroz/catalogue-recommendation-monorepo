import { AggregateRoot } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  userId!: string;
  @ApiProperty({ example: 103157 })
  showId!: number;
  @ApiProperty({ example: 'The Hidden Dungeon Only I Can Enter' })
  name!: string;
  @ApiProperty({
    example: 'Action & Adventure, Animation, Comedy, Sci-Fi & Fantasy',
  })
  genres!: string;
  @ApiProperty({ example: 2021 })
  releaseYear!: number;
  @ApiProperty({ example: 8.074999809265137 })
  voteAverage!: number;
  @ApiProperty({ example: 25.82200050354004 })
  popularity!: number;
  @ApiProperty({ example: 0.5690665245056152 })
  score!: number;
  constructor(props: RecommendationProps) {
    super();
    Object.assign(this, props);
  }
}
