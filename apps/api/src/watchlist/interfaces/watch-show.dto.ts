import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class WatchShowDto {
  @ApiProperty({example: 127532})
  @IsInt()
  showId: number;
}
