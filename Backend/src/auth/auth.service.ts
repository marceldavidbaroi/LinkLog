import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentailsDto: AuthCredentailsDto): Promise<void> {
    const { username, password } = authCredentailsDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async signin(
    authCredentailsDto: AuthCredentailsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = authCredentailsDto;

    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Hash the refresh token before saving (for security)
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  async refresh(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    // Compare hashed refresh token
    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { accessToken };
  }

  async logout(userId: number): Promise<void> {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      // Optional: throw error if user not found
      throw new UnauthorizedException('User not found');
    }

    // Clear the refresh token
    user.refreshToken = undefined;

    // Save the updated user
    await this.userRepository.save(user);
  }
}
