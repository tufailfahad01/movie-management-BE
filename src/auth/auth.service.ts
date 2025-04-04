import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prisma/prisma.service';
import { comparePassword, hashPassword } from '../utils/utility.functions';
import { RegisterDto } from './dto/register.dto';
import { LogInDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const checkExistingEmail = await this.prismaService.user.findUnique({
        where: { email: registerDto.email.toLowerCase() },
      });

      if (checkExistingEmail) {
        throw new HttpException(
          'This email already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await hashPassword(registerDto.password);
      const userCreated = await this.prismaService.user.create({
        data: {
          ...registerDto,
          name: registerDto.name,
          email: registerDto.email.toLowerCase(),
          password: hashedPassword,
          role: registerDto.role ?? 'USER', // Default role if not provided
        },
      });

      if (!userCreated) {
        throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: 'User created. Verify your account.',
        data: { name: userCreated.name, email: userCreated.email },
      };
    } catch (error) {
      throw error;
    }
  }


  async login(loginDto: LogInDto) {
    const email = loginDto.email.trim().toLowerCase();
    const password = loginDto.password.trim();

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });


    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.generateToken(user.id);

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: token,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async findOneUserByID(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async generateToken(id: string): Promise<string> {
    if (!id) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const payload = { id };
    const jwt_secret = this.configService.get<string>('JWT_SECRET');
    const jwt_expiryTime = this.configService.get<number>('JWT_EXPIRY_TIME');

    if (!jwt_secret || !jwt_expiryTime) {
      throw new HttpException('JWT secret or expiry time is missing in environment variables.', HttpStatus.BAD_REQUEST);
    }

    return this.jwt.signAsync(payload, {
      expiresIn: jwt_expiryTime,
      secret: jwt_secret,
    });
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const isOldPasswordValid = await comparePassword(
      resetPasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    const hashedPassword = await hashPassword(resetPasswordDto.newPassword);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password updated successfully' };
  }

  async getUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
  }

}
