import { Command } from '@nestjs/cqrs';

export class WatchShowCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly showId: string,
  ) {
    super();
  }
}
