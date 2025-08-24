import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentailsDto: AuthCredentailsDto): Promise<void> {
    return this.authService.signup(authCredentailsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentailsDto: AuthCredentailsDto,
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

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User) {
    console.log(user);
  }
}
