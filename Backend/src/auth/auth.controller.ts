import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { SigninDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCredentailsDto: AuthCredentailsDto,
  ): Promise<{ message: string }> {
    return this.authService.signup(authCredentailsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentailsDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: Partial<User>; accessToken: string }> {
    return this.authService.signin(authCredentailsDto, res);
  }

  @Post('/refresh')
  refresh(@Req() req: Request): Promise<{ accessToken: string }> {
    // Type assertion to satisfy TypeScript/ESLint
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    return this.authService.refreshFromCookie(refreshToken);
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt')) // ensure user is authenticated
  logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.clearCookie('refreshToken'); // clear cookie on client
    return this.authService.logout(user.id); // clear token in DB
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@GetUser() user: User, @Body() updateData: Partial<User>) {
    return this.authService.updateProfile(user.id, updateData);
  }

  @Patch('/me/preferences')
  @UseGuards(AuthGuard('jwt'))
  updatePreferences(
    @GetUser() user: User,
    @Body() updateData: { frontend?: any; backend?: any },
  ) {
    return this.authService.updatePreferences(user.id, updateData);
  }
}
