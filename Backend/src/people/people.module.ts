import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { People } from './people.entity';

@Module({
  imports: [TypeOrmModule.forFeature([People])], // 👈 THIS is required
  providers: [PeopleService],
  controllers: [PeopleController],
})
export class PeopleModule {}
