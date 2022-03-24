import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';

const mockUsersRepository = () => ({
  getUsers: jest.fn(),
});

const mockUsers = [
  {
    id: 'fc0b9630-1a36-48fd-a5d5-e49be903aa31',
    name: 'Agunk Hidayat',
    avatar: null,
  },
  {
    id: 'fc0b9630-1a36-48fd-a5d5-e49be904vv23',
    name: 'Fajar Haikal',
    avatar: null,
  },
];

describe('UsersService', () => {
  let service: UsersService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useFactory: mockUsersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      repository.getUsers.mockResolvedValue(mockUsers);

      const result = await service.getUsers(null);
      expect(result).toEqual(mockUsers);
    });

    it('should return an empty list of projects', async () => {
      repository.getUsers.mockResolvedValue([]);

      const searchName = {
        name: 'Not Exist User',
      };
      const result = await service.getUsers(searchName);
      expect(result).toEqual([]);
    });
  });
});
