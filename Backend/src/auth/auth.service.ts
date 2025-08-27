import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { AuthCredentailsDto } from './dto/auth-credentials.dto';
import { SigninDto } from './dto/sign-in.dto';
import { UserPreferences } from './userPreferences.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserPreferences)
    private preferencesRepository: Repository<UserPreferences>,
    private jwtService: JwtService,
  ) {}

  async signup(
    authCredentailsDto: AuthCredentailsDto,
  ): Promise<{ message: string }> {
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

      // Create default preferences
      const preferences = this.preferencesRepository.create({
        user,
        frontend: {},
        backend: {},
      });
      await this.preferencesRepository.save(preferences);

      return { message: 'Signup successful' };
    } catch {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async signin(authCredentailsDto: SigninDto): Promise<{
    user: Partial<User>;
    accessToken: string;
    refreshToken: string;
  }> {
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

    // Don’t expose password or hashed refresh token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...safeUser } = user;

    return { user: safeUser, accessToken, refreshToken };
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
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences'],
    });
    if (!user) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...safeUser } = user;

    return {
      ...safeUser,
      preferences: user.preferences || { frontend: {}, backend: {} },
    };
  }

  async updateProfile(userId: number, updateData: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateData);
    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...safeUser } = user;
    return safeUser;
  }

  async updatePreferences(
    userId: number,
    updateData: { frontend?: any; backend?: any },
  ) {
    let prefs = await this.preferencesRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!prefs) {
      // Create if not exist
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      prefs = this.preferencesRepository.create({
        user,
        frontend: {},
        backend: {},
      });
    }

    // Merge updates without overwriting other fields
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prefs.frontend = { ...prefs.frontend, ...updateData.frontend };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    prefs.backend = { ...prefs.backend, ...updateData.backend };

    await this.preferencesRepository.save(prefs);

    return prefs;
  }
}
