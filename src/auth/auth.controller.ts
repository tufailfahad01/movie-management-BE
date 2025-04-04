import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

import { JwtGuard } from './jwt/jwt.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Log in an existing user' })
  @Post('login')
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Reset password for an authenticated user' })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('resetPassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    console.log("userId", req.user)
    return this.authService.resetPassword(req.user.id, resetPasswordDto);
  }
}
