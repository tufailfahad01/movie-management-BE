import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'SUPER_ADMIN'; // Add more roles if needed
}

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto, user: User) {
    try {
      const movie = await this.prisma.movie.create({
        data: { ...createMovieDto, userId: user.id },
      });
      return {
        success: true,
        data: movie,
        message: 'Successfully Movie created',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(user: User) {
    try {
      const movies = await this.prisma.movie.findMany({
        where: { userId: user.id },
      });
      return {
        success: true,
        data: movies,
        message: 'Successfully Movies fetched',
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (!movie) {
        throw new HttpException(
          `Movie with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        success: true,
        data: movie,
        message: 'Movie fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    try {
      const movie = await this.prisma.movie.update({
        where: { id },
        data: updateMovieDto,
      });
      return {
        success: true,
        data: movie,
        message: 'Movie updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const movie = await this.prisma.movie.delete({ where: { id } });
      return {
        success: true,
        data: movie,
        message: 'Movie deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
