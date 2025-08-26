// src/people/people.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { People } from './people.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';

const mockUser: User = { id: 1, username: 'test', password: 'pass' } as User;

describe('PeopleService', () => {
  let service: PeopleService;
  let repo: jest.Mocked<Repository<People>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getRepositoryToken(People),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    repo = module.get(getRepositoryToken(People));
  });

  it('should create a person', async () => {
    const dto = { firstname: 'John', lastname: 'Doe' } as any;
    const created = { ...dto, user_id: mockUser.id };

    repo.create.mockReturnValue(created as People);
    repo.save.mockResolvedValue(created as People);

    const result = await service.create(dto, mockUser);
    expect(repo.create).toHaveBeenCalledWith({ ...dto, user_id: mockUser.id });
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('should return all people for user', async () => {
    const people = [{ id: 1, firstname: 'Jane', user_id: 1 }] as People[];
    repo.find.mockResolvedValue(people);

    const result = await service.findAll(mockUser);
    expect(repo.find).toHaveBeenCalledWith({ where: { user_id: 1 } });
    expect(result).toEqual(people);
  });

  it('should return one person', async () => {
    const person = { id: 1, firstname: 'Test', user_id: 1 } as People;
    repo.findOne.mockResolvedValue(person);

    const result = await service.findOne(1, mockUser);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1, user_id: 1 } });
    expect(result).toEqual(person);
  });

  it('should throw if person not found', async () => {
    repo.findOne.mockResolvedValue(undefined);

    await expect(service.findOne(1, mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a person', async () => {
    const person = { id: 1, firstname: 'Old', user_id: 1 } as People;
    repo.findOne.mockResolvedValue(person);
    repo.save.mockResolvedValue({ ...person, firstname: 'New' });

    const result = await service.update(1, { firstname: 'New' }, mockUser);
    expect(result.firstname).toBe('New');
  });

  it('should remove a person', async () => {
    const person = { id: 1, firstname: 'Delete', user_id: 1 } as People;
    repo.findOne.mockResolvedValue(person);
    repo.remove.mockResolvedValue(undefined as any);

    await service.remove(1, mockUser);
    expect(repo.remove).toHaveBeenCalledWith(person);
  });
});
