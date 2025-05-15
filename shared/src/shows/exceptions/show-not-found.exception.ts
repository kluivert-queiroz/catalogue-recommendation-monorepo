import { HttpException, HttpStatus } from '@nestjs/common';

export class ShowNotFoundException extends HttpException {
  constructor(showId: number) {
    super(`Show ID ${showId} not found`, HttpStatus.NOT_FOUND);
  }
}
