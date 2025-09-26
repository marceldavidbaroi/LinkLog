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
import type { ApiResponse } from 'src/common/types/api-response.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentailsDto: AuthCredentailsDto,
  ): Promise<ApiResponse<null>> {
    await this.authService.signup(authCredentailsDto);
    return {
      success: true,
      message: 'User signed up successfully',
      data: null,
    };
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentailsDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<{ user: Partial<User>; accessToken: string }>> {
    const result = await this.authService.signin(authCredentailsDto, res);
    return {
      success: true,
      message: 'User signed in successfully',
      data: result,
    };
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    const cookies = req.cookies as Record<string, string>;
    const refreshToken = cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    const result = await this.authService.refreshFromCookie(refreshToken);
    return {
      success: true,
      message: 'Access token refreshed successfully',
      data: result,
    };
  }

  @Post('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<null>> {
    res.clearCookie('refreshToken');
    await this.authService.logout(user.id);
    return {
      success: true,
      message: 'User logged out successfully',
      data: null,
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@GetUser() user: User): Promise<ApiResponse<Partial<User>>> {
    const profile = await this.authService.getProfile(user.id);
    return {
      success: true,
      message: 'Profile fetched successfully',
      data: profile,
    };
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @GetUser() user: User,
    @Body() updateData: Partial<User>,
  ): Promise<ApiResponse<Partial<User>>> {
    const updated = await this.authService.updateProfile(user.id, updateData);
    return {
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    };
  }

  @Patch('/me/preferences')
  @UseGuards(AuthGuard('jwt'))
  async updatePreferences(
    @GetUser() user: User,
    @Body() updateData: { frontend?: any; backend?: any },
  ): Promise<ApiResponse<{ frontend?: any; backend?: any }>> {
    const updated = await this.authService.updatePreferences(
      user.id,
      updateData,
    );
    return {
      success: true,
      message: 'Preferences updated successfully',
      data: updated,
    };
  }
}
