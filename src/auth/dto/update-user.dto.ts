import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsOptional()
  name: string;
}

