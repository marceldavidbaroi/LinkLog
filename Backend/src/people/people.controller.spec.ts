// src/people/people.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { People } from './people.entity';
import { User } from '../auth/user.entity';

const mockUser: User = { id: 1, username: 'test', password: 'pass' } as User;

describe('PeopleController', () => {
  let controller: PeopleController;
  let service: PeopleService;

  const mockPeopleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [{ provide: PeopleService, useValue: mockPeopleService }],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    service = module.get<PeopleService>(PeopleService);
  });

  it('should create a person', async () => {
    const dto = { firstname: 'John' } as any;
    const person = { id: 1, ...dto, user_id: 1 } as People;

    mockPeopleService.create.mockResolvedValue(person);

    expect(await controller.create(dto, mockUser)).toEqual(person);
    expect(service.create).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should return all people', async () => {
    const people = [{ id: 1, firstname: 'Jane' }] as People[];
    mockPeopleService.findAll.mockResolvedValue(people);

    expect(await controller.findAll(mockUser)).toEqual(people);
  });

  it('should return one person', async () => {
    const person = { id: 1, firstname: 'Test' } as People;
    mockPeopleService.findOne.mockResolvedValue(person);

    expect(await controller.findOne(1, mockUser)).toEqual(person);
  });

  it('should update a person', async () => {
    const updated = { id: 1, firstname: 'Updated' } as People;
    mockPeopleService.update.mockResolvedValue(updated);

    expect(
      await controller.update(1, { firstname: 'Updated' }, mockUser),
    ).toEqual(updated);
  });

  it('should remove a person', async () => {
    mockPeopleService.remove.mockResolvedValue(undefined);

    await controller.remove(1, mockUser);
    expect(service.remove).toHaveBeenCalledWith(1, mockUser);
  });
});
