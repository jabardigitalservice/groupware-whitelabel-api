import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUserInterface } from '../../common/interfaces/get-user.interface';
import lang from '../../common/language/configuration';
import { BadRequestException } from '@nestjs/common';

const mockUsersRepository = () => ({
  getUsers: jest.fn(),
  save: jest.fn(),
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

const mockUser = {
  id: '6a1daa89-7be7-42fb-8d79-e3d4d2c78cda',
  name: 'Groupware White Label Administrator',
  email: 'groupware.whitelabel@gmail.com',
  password: bcrypt.hashSync('123456', 10),
  isActive: true,
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: null,
};

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

  describe('changePassword', () => {
    it('should throw an error when current password is invalid', async () => {
      const user: GetUserInterface = mockUser;

      const changePasswordDto: ChangePasswordDto = {
        currentPassword: '1234567',
        newPassword: '12345678',
        confirmNewPassword: '12345678',
      };

      await expect(
        service.changePassword(user, changePasswordDto),
      ).rejects.toThrow(
        new BadRequestException(
          lang.__('users.changePassword.currentPassword.invalid'),
        ),
      );
    });

    it('should throw an error when new password is same with current password', async () => {
      const user: GetUserInterface = mockUser;

      const changePasswordDto: ChangePasswordDto = {
        currentPassword: '123456',
        newPassword: '123456',
        confirmNewPassword: '123456',
      };

      await expect(
        service.changePassword(user, changePasswordDto),
      ).rejects.toThrow(
        new BadRequestException(
          lang.__('users.changePassword.newPassword.invalid'),
        ),
      );
    });

    it('should change password', async () => {
      const user: GetUserInterface = mockUser;

      const changePasswordDto: ChangePasswordDto = {
        currentPassword: '123456',
        newPassword: '12345678',
        confirmNewPassword: '12345678',
      };

      const result = await service.changePassword(user, changePasswordDto);
      expect(result).toBeUndefined();
    });
  });
});
