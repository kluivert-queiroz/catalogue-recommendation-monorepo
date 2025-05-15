import { Command } from '@nestjs/cqrs';

export class RecommendMoreShowsCommand extends Command<void> {
  constructor(public readonly userId: string, public readonly showId: number) {
    super();
  }
}
