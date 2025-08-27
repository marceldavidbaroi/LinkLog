import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { SigninDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';

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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signin(authCredentailsDto);
  }

  @Post('/refresh')
  refresh(
    @Body() body: { userId: number; refreshToken: string },
  ): Promise<{ accessToken: string }> {
    return this.authService.refresh(body.userId, body.refreshToken);
  }

  @Post('/logout')
  logout(@Body() body: { userId: number }): Promise<void> {
    return this.authService.logout(body.userId);
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

  // @Get('/test')
  // @UseGuards(AuthGuard('jwt'))
  // getProfile(@GetUser() user: User) {
  //   console.log(user);
  // }
}
