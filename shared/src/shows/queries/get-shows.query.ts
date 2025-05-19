import { Query } from '@nestjs/cqrs';
import { ShowModel } from '../models';
import { Paginated } from 'src/lib/postgres';
import { GetShowsDto } from '../interfaces/get-shows.dto';

export class GetShowsQuery extends Query<Paginated<ShowModel>> {
  constructor(public readonly params: GetShowsDto) {
    super();
  }
}
