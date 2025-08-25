// src/people/people.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { People } from './people.entity';
import { CreatePeopleDto } from './dto/create-people.dto';
import { UpdatePeopleDto } from './dto/update-people.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
  ) {}

  async create(createPeopleDto: CreatePeopleDto, user: User): Promise<People> {
    const people = this.peopleRepository.create({
      ...createPeopleDto,
      user_id: user.id,
    });
    return this.peopleRepository.save(people);
  }

  async findAll(user: User): Promise<People[]> {
    return this.peopleRepository.find({ where: { user_id: user.id } });
  }

  async findOne(id: number, user: User): Promise<People> {
    const person = await this.peopleRepository.findOne({
      where: { id, user_id: user.id },
    });
    if (!person) {
      throw new NotFoundException(
        `Person with ID ${id} not found for this user`,
      );
    }
    return person;
  }

  async update(
    id: number,
    updatePeopleDto: UpdatePeopleDto,
    user: User,
  ): Promise<People> {
    const person = await this.findOne(id, user); // ensures ownership
    Object.assign(person, updatePeopleDto);
    return this.peopleRepository.save(person);
  }

  async remove(id: number, user: User): Promise<void> {
    const person = await this.findOne(id, user); // ensures ownership
    await this.peopleRepository.remove(person);
  }
}
