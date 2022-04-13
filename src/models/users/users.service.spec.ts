import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUserInterface } from '../../common/interfaces/get-user.interface';
import lang from '../../common/language/configuration';
import { BadRequestException } from '@nestjs/common';
import { MinioProviderService } from '../../providers/storage/minio/minio.service';
import { UserProfileRepository } from '../user-profiles/user-profile.repository';
import { MinioConfigService } from '../../config/storage/minio-client/config.service';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { User } from './entities/user.entity';
import { UserProfile } from '../user-profiles/entities/user-profile.entity';

const mockUsersRepository = () => ({
  getUsers: jest.fn(),
  save: jest.fn(),
});

const mockMinioProviderService = () => ({
  upload: jest.fn(),
  delete: jest.fn(),
});

const mockUserProfileRepository = () => ({
  save: jest.fn(),
});

const mockImage: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'someFileName',
  encoding: 'someEncoding',
  mimetype: 'someMimeType',
  destination: 'someDestination',
  filename: 'someFileName',
  path: 'somePath',
  buffer: Buffer.from('someBuffer'),
  size: 0,
  stream: new Readable(),
};

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

const mockUser: User = {
  id: '6a1daa89-7be7-42fb-8d79-e3d4d2c78cda',
  name: 'Groupware White Label Administrator',
  email: 'groupware.whitelabel@gmail.com',
  password: bcrypt.hashSync('123456', 10),
  isActive: true,
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: null,
  userProfile: null,
  hashPassword: jest.fn(),
  logbooks: [],
  userSocialAccounts: [],
  userTokens: [],
  attendances: [],
  daysoff: [],
};

const mockUserProfile: UserProfile = {
  id: '6a1daa89-7be7-42fb-8d79-e3d4d2c78cda',
  user: null,
  avatar: 'avatar.png',
  jobTitleId: '',
  jobTitle: null,
  birthDate: undefined,
  birthPlace: '',
  gender: '',
  employmentStatus: '',
  isPns: false,
};

describe('UsersService', () => {
  let service: UsersService;
  let repository;
  let minioProviderService: MinioProviderService;
  let userProfileRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        ConfigService,
        MinioConfigService,
        { provide: UserRepository, useFactory: mockUsersRepository },
        {
          provide: MinioProviderService,
          useFactory: mockMinioProviderService,
        },
        {
          provide: UserProfileRepository,
          useFactory: mockUserProfileRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
    minioProviderService = await module.get(MinioProviderService);
    userProfileRepository = await module.get(UserProfileRepository);
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

  describe('uploadAvatar', () => {
    it('should upload avatar', async () => {
      const user = mockUser;
      user.userProfile = mockUserProfile;

      (minioProviderService.upload as jest.Mock).mockReturnValue(
        Promise.resolve({
          path: 'somePath',
        }),
      );

      const result = await service.uploadAvatar(user, mockImage);
      expect(result.avatar_path).toBe('somePath');
    });

    it('should throw an error when upload avatar failed', async () => {
      const user = mockUser;
      user.userProfile = mockUserProfile;

      (minioProviderService.upload as jest.Mock).mockReturnValue(
        Promise.reject(new Error('someError')),
      );

      await expect(
        service.uploadAvatar(user, mockImage),
      ).rejects.toThrowError();
    });
  });

  describe('deleteAvatar', () => {
    it('should delete avatar', async () => {
      const user = mockUser;
      user.userProfile = mockUserProfile;

      (minioProviderService.delete as jest.Mock).mockReturnValue(
        Promise.resolve(),
      );

      const result = await service.deleteAvatar(user);
      expect(user.userProfile.avatar).toBeNull();
      expect(result).toBeUndefined();
    });

    it('should throw an error when delete avatar failed', async () => {
      const user = mockUser;
      user.userProfile = mockUserProfile;

      (userProfileRepository.save as jest.Mock).mockReturnValue(
        Promise.reject(new Error('someError')),
      );

      await expect(service.deleteAvatar(user)).rejects.toThrowError();
    });
  });
});
