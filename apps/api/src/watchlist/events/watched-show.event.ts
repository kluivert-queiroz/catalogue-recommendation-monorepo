import { ShowEntity } from '../../shows/repositories/entities/show.entity';

export class WatchedShowEvent {
  constructor(
    public readonly userId: string,
    public readonly show: ShowEntity
  ) {}
}
