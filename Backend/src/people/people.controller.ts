// src/people/people.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { People } from './people.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('people')
@UseGuards(AuthGuard('jwt'))
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(
    @Body() createPeopleDto: CreatePeopleDto,
    @GetUser() user: User,
  ): Promise<People> {
    return this.peopleService.create(createPeopleDto, user);
  }

  @Get()
  findAll(@GetUser() user: User): Promise<People[]> {
    return this.peopleService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<People> {
    return this.peopleService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeopleDto: UpdatePeopleDto,
    @GetUser() user: User,
  ): Promise<People> {
    return this.peopleService.update(id, updatePeopleDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.peopleService.remove(id, user);
  }
}
