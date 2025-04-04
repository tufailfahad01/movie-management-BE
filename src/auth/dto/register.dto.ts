import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', description: 'User password', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'USER', description: 'User role', required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

}