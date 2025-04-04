import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsOptional()
  name: string;
}

