import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class GetShowsDto {
  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  genres: string;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsInt()
  voteAverage: number;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsInt()
  skip: number;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsInt()
  take: number;
}
