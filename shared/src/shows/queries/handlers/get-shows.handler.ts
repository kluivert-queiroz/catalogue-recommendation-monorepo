import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetShowsQuery } from '../get-shows.query';
import { ShowModel } from 'src/shows/models';
import { ShowsService } from '../../services/shows.service';
import { Paginated } from 'src/lib/postgres';

@QueryHandler(GetShowsQuery)
export class GetShowsHandler implements IQueryHandler<GetShowsQuery> {
  constructor(private readonly showsService: ShowsService) {}
  execute({
    params: { skip, take, name, genres, voteAverage },
  }: GetShowsQuery): Promise<Paginated<ShowModel>> {
    return this.showsService.findShowsPaginated({
      take,
      skip,
      search: {
        name,
        genres,
        voteAverage,
      },
    });
  }
}
