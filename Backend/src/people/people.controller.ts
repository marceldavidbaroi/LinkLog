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
import { ApiResponse } from 'src/common/types/api-response.type';

@Controller('people')
@UseGuards(AuthGuard('jwt'))
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  async create(
    @Body() createPeopleDto: CreatePeopleDto,
    @GetUser() user: User,
  ): Promise<ApiResponse<People>> {
    const person = await this.peopleService.create(createPeopleDto, user);
    return {
      success: true,
      message: 'Person created successfully',
      data: person,
    };
  }

  @Get()
  async findAll(@GetUser() user: User): Promise<ApiResponse<People[]>> {
    const people = await this.peopleService.findAll(user);
    return {
      success: true,
      message: 'People list retrieved successfully',
      data: people,
      meta: {
        page: 1,
        limit: people.length,
        total: people.length,
      },
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<ApiResponse<People>> {
    const person = await this.peopleService.findOne(id, user);
    return {
      success: true,
      message: `Person with ID ${id} retrieved successfully`,
      data: person,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeopleDto: UpdatePeopleDto,
    @GetUser() user: User,
  ): Promise<ApiResponse<People>> {
    const person = await this.peopleService.update(id, updatePeopleDto, user);
    return {
      success: true,
      message: `Person with ID ${id} updated successfully`,
      data: person,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<ApiResponse<null>> {
    await this.peopleService.remove(id, user);
    return {
      success: true,
      message: `Person with ID ${id} deleted successfully`,
      data: null,
    };
  }
}
