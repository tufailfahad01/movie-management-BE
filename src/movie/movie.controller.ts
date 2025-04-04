import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';

@Controller('movie')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Movie' })
  @ApiResponse({ status: 200, description: 'Get Movie after Creating.' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Movies' })
  @ApiResponse({ status: 200, description: 'Get list of all Movies.' })
  findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Movie by ID' })
  @ApiResponse({ status: 200, description: 'The Movie with the given ID.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'The Movie has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'The Movie has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
