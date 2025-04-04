import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'OldPassword123!', description: 'Current password of the user' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'New password', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s]).{8,}$/, {
    message:
      'Invalid Password: Password should have at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 digit, and more than 8 characters',
  })
  newPassword: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'Confirmation of new password', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  confirmNewPassword: string;
}
