import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interactions } from './interactions.entity';
import { Repository } from 'typeorm';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { User } from 'src/auth/user.entity';
import { People } from 'src/people/people.entity';

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

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interactions)
    @InjectRepository(Interactions)
    private interactionsRepository: Repository<Interactions>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(People)
    private peopleRepository: Repository<People>,
  ) {}

  // CREATE a new interaction
  async create(
    createInteractionDto: CreateInteractionDto,
    user_id: number,
  ): Promise<Interactions> {
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (!user) throw new NotFoundException(`User with id ${user_id} not found`);

    let person: People | undefined | null;
    if (createInteractionDto.person_id) {
      person = await this.peopleRepository.findOneBy({
        id: createInteractionDto.person_id,
      });
      if (!person)
        throw new NotFoundException(
          `Person with id ${createInteractionDto.person_id} not found`,
        );
    }

    const interaction = this.interactionsRepository.create({
      ...createInteractionDto,
      user: { id: user.id }, // ✅ just the id
      person: person ? { id: person.id } : undefined, // ✅ undefined if not set
    });

    return this.interactionsRepository.save(interaction);
  }

  // FIND all interactions for a user with filtering, sorting, and pagination
  async findAllByUser(
    user_id: number,
    personName?: string,
    sortOptions?: InteractionSortOptions,
    filterOptions?: InteractionFilterOptions,
    paginationOptions?: PaginationOptions,
  ): Promise<Interactions[]> {
    const query = this.interactionsRepository
      .createQueryBuilder('interaction')
      .leftJoinAndSelect('interaction.person', 'person')
      .where('interaction.user_id  = :userId', { userId: user_id });

    // Filter by person name
    if (personName) {
      query.andWhere(
        'person.firstname ILIKE :name OR person.lastname ILIKE :name',
        { name: `%${personName}%` },
      );
    }

    // Filter by tags
    if (filterOptions?.tags && filterOptions.tags.length > 0) {
      filterOptions.tags.forEach((tag) => {
        query.andWhere(`:tag = ANY(string_to_array(interaction.tags, ','))`, {
          tag,
        });
      });
    }

    // Filter by date range
    if (filterOptions?.fromDate) {
      query.andWhere('interaction.date >= :fromDate', {
        fromDate: filterOptions.fromDate,
      });
    }
    if (filterOptions?.toDate) {
      query.andWhere('interaction.date <= :toDate', {
        toDate: filterOptions.toDate,
      });
    }

    // Sorting
    if (sortOptions?.sortByPersonName) {
      query
        .addOrderBy('person.firstname', sortOptions.sortByPersonName)
        .addOrderBy('person.lastname', sortOptions.sortByPersonName);
    }
    if (sortOptions?.sortByUpdatedAt) {
      query.addOrderBy('interaction.updatedAt', sortOptions.sortByUpdatedAt);
    }

    // Pagination
    if (paginationOptions) {
      const skip = (paginationOptions.page - 1) * paginationOptions.limit;
      query.skip(skip).take(paginationOptions.limit);
    }

    return query.getMany();
  }

  // FIND one interaction
  async findOne(id: number): Promise<Interactions> {
    const interaction = await this.interactionsRepository.findOne({
      where: { id },
      relations: ['user', 'person'],
    });
    if (!interaction)
      throw new NotFoundException(`Interaction with id ${id} not found`);
    return interaction;
  }

  // UPDATE interaction
  async update(
    id: number,
    updateData: UpdateInteractionDto,
  ): Promise<Interactions> {
    const interaction = await this.interactionsRepository.findOne({
      where: { id },
      relations: ['user', 'person'],
    });
    if (!interaction)
      throw new NotFoundException(`Interaction with id ${id} not found`);

    // Handle optional person update
    if (updateData.person_id !== undefined) {
      if (updateData.person_id === null) {
        interaction.person = undefined;
      } else {
        const person = await this.peopleRepository.findOneBy({
          id: updateData.person_id,
        });
        if (!person)
          throw new NotFoundException(
            `Person with id ${updateData.person_id} not found`,
          );
        interaction.person = person;
      }
      delete updateData.person_id;
    }

    Object.assign(interaction, updateData);
    return this.interactionsRepository.save(interaction);
  }

  // DELETE interaction
  async remove(id: number): Promise<void> {
    const result = await this.interactionsRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Interaction with id ${id} not found`);
  }
}
