import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecommendMoreShowsCommand } from '../recommend-more-shows.command';
import {
  ShowsService,
  Recommendation,
  RecommendationsRepository,
} from '@catalogue-recommendation-monorepo/shared';

@CommandHandler(RecommendMoreShowsCommand)
export class RecommendMoreShowsHandler
  implements ICommandHandler<RecommendMoreShowsCommand>
{
  constructor(
    private readonly showsService: ShowsService,
    private readonly recommendationsRepository: RecommendationsRepository
  ) {}
  async execute(command: RecommendMoreShowsCommand): Promise<void> {
    const show = await this.showsService.getShowById(command.showId);
    if (!show) {
      console.log('Show not found');
      return;
    }
    const recommendations = await this.showsService.getRecommendations(show.id);
    recommendations
      .map(
        ({
          score,
          payload: { id, genres, name, popularity, releaseYear, voteAverage },
        }) =>
          new Recommendation({
            userId: command.userId,
            showId: id,
            genres,
            name,
            popularity,
            releaseYear,
            voteAverage,
            score,
          })
      )
      .map(
        this.recommendationsRepository.save.bind(this.recommendationsRepository)
      );
    await Promise.all(recommendations);
  }
}
