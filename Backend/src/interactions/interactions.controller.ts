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
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Interactions } from './interactions.entity';

interface InteractionSortOptions {
  sortByPersonName?: 'ASC' | 'DESC';
  sortByUpdatedAt?: 'ASC' | 'DESC';
}

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  // CREATE a new interaction
  @Post()
  create(
    @Body() createInteractionDto: CreateInteractionDto,
    @GetUser() user: User,
    @Query('personId', ParseIntPipe) personId: number,
  ): Promise<Interactions> {
    return this.interactionsService.create(
      createInteractionDto,
      user.id,
      personId,
    );
  }

  // GET all interactions for a user (optionally filter by personName and sort)
  @Get()
  findAllByUser(
    @GetUser() user: User,
    @Query('personName') personName?: string,
    @Query('sortByPersonName') sortByPersonName?: 'ASC' | 'DESC',
    @Query('sortByUpdatedAt') sortByUpdatedAt?: 'ASC' | 'DESC',
  ): Promise<Interactions[]> {
    const sortOptions: InteractionSortOptions = {
      sortByPersonName,
      sortByUpdatedAt,
    };

    return this.interactionsService.findAllByUser(
      user.id,
      personName,
      sortOptions,
    );
  }

  // UPDATE an interaction
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateInteractionDto>,
  ): Promise<Interactions> {
    return this.interactionsService.update(id, updateData);
  }

  // DELETE an interaction
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.interactionsService.remove(id);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Interactions> {
    return this.interactionsService.findOne(id);
  }
}
