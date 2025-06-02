export class WatchedShowEvent {
  constructor(
    public readonly userId: string,
    public readonly showId: number
  ) {}
}
