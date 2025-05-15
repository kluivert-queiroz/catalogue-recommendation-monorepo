import { ShowModel } from 'src/shows';

export class WatchedShowEvent {
  constructor(
    public readonly userId: string,
    public readonly show: ShowModel
  ) {}
}
