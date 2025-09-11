import { Module } from '@nestjs/common';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interactions } from './interactions.entity';
import { People } from 'src/people/people.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interactions, People, User])], // 👈 THIS is required
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class InteractionsModule {}
