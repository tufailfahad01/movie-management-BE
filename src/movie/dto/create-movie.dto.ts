import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Johnwick', description: 'Full name of the movie' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2021', description: 'Publish Year of movie' })
  @IsNotEmpty()
  @IsNumber()
  publishYear: number;

  @ApiProperty({
    example: 'http://xyz.png',
    description: 'Poster(Image) of movie',
  })
  @IsNotEmpty()
  poster: string;
}
