import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Interactions } from './interactions.entity';
import { Repository } from 'typeorm';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { User } from 'src/auth/user.entity';
import { People } from 'src/people/people.entity';

interface InteractionSortOptions {
  sortByPersonName?: 'ASC' | 'DESC';
  sortByUpdatedAt?: 'ASC' | 'DESC';
}

@Injectable()
export class InteractionsService {
  constructor(
    @InjectRepository(Interactions)
    private interactionsRepository: Repository<Interactions>,
    private userRepository: Repository<User>,
    private peopleRepository: Repository<People>,
  ) {}

  async create(
    createInteractionDto: CreateInteractionDto,
    user_id: number,
    person_id: number,
  ): Promise<Interactions> {
    // 1️⃣ Fetch the related user
    const user = await this.userRepository.findOneBy({ id: user_id });
    if (!user) throw new NotFoundException(`User with id ${user_id} not found`);

    // 2️⃣ Fetch the related person
    const person = await this.peopleRepository.findOneBy({ id: person_id });
    if (!person)
      throw new NotFoundException(`Person with id ${person_id} not found`);

    const interaction = this.interactionsRepository.create({
      ...createInteractionDto,
      user, // assign relation entity
      person, // assign relation entity
    });

    return this.interactionsRepository.save(interaction);
  }

  async findAllByUser(
    user_id: number,
    personName?: string,
    sortOptions?: InteractionSortOptions,
  ): Promise<Interactions[]> {
    const query = this.interactionsRepository
      .createQueryBuilder('interaction')
      .leftJoinAndSelect('interaction.person', 'person')
      .where('interaction.userId = :userId', { userId: user_id });

    // optional filter by person name
    if (personName) {
      query.andWhere(
        'person.firstname ILIKE :name OR person.lastname ILIKE :name',
        {
          name: `%${personName}%`,
        },
      );
    }

    // dynamic sorting based on user preference
    if (sortOptions?.sortByPersonName) {
      query
        .addOrderBy('person.firstname', sortOptions.sortByPersonName)
        .addOrderBy('person.lastname', sortOptions.sortByPersonName);
    }

    if (sortOptions?.sortByUpdatedAt) {
      query.addOrderBy('interaction.updated_at', sortOptions.sortByUpdatedAt);
    }

    return query.getMany();
  }

  // UPDATE method
  async update(
    id: number,
    updateData: Partial<CreateInteractionDto>,
  ): Promise<Interactions> {
    const interaction = await this.interactionsRepository.findOne({
      where: { id },
      relations: ['user', 'person'],
    });

    if (!interaction)
      throw new NotFoundException(`Interaction with id ${id} not found`);

    // Merge new data
    Object.assign(interaction, updateData);

    return this.interactionsRepository.save(interaction);
  }

  // DELETE method
  async remove(id: number): Promise<void> {
    const result = await this.interactionsRepository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`Interaction with id ${id} not found`);
  }
  // InteractionsService
  async findOne(id: number): Promise<Interactions> {
    const interaction = await this.interactionsRepository.findOne({
      where: { id },
      relations: ['user', 'person'],
    });

    if (!interaction)
      throw new NotFoundException(`Interaction with id ${id} not found`);

    return interaction;
  }
}
