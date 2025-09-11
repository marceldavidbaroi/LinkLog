import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Interactions } from './interactions.entity';

interface InteractionSortOptions {
  sortByPersonName?: 'ASC' | 'DESC';
  sortByUpdatedAt?: 'ASC' | 'DESC';
}

interface InteractionFilterOptions {
  tags?: string[];
  fromDate?: string;
  toDate?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
}

@Controller('interactions')
@UseGuards(AuthGuard('jwt'))
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  // CREATE a new interaction
  @Post()
  create(
    @Body() createInteractionDto: CreateInteractionDto,
    @GetUser() user: User,
  ): Promise<Interactions> {
    // Pass the DTO and user ID; service handles optional person_id
    return this.interactionsService.create(createInteractionDto, user.id);
  }

  // GET all interactions for a user with filtering, sorting, and pagination
  @Get()
  findAllByUser(
    @GetUser() user: User,
    @Query('personName') personName?: string,
    @Query('tags') tags?: string, // comma-separated
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('sortByPersonName') sortByPersonName?: 'ASC' | 'DESC',
    @Query('sortByUpdatedAt') sortByUpdatedAt?: 'ASC' | 'DESC',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<Interactions[]> {
    const sortOptions: InteractionSortOptions = {
      sortByPersonName,
      sortByUpdatedAt,
    };

    const filterOptions: InteractionFilterOptions = {
      tags: tags ? tags.split(',') : undefined,
      fromDate,
      toDate,
    };

    const paginationOptions: PaginationOptions = { page, limit };

    return this.interactionsService.findAllByUser(
      user.id,
      personName,
      sortOptions,
      filterOptions,
      paginationOptions,
    );
  }

  // GET a single interaction
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Interactions> {
    return this.interactionsService.findOne(id);
  }

  // UPDATE an interaction
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateInteractionDto,
  ): Promise<Interactions> {
    return this.interactionsService.update(id, updateData);
  }

  // DELETE an interaction
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.interactionsService.remove(id);
  }
}
