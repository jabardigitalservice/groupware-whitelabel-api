import { Test } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { AppConfigService } from '../../config/app/config.service';
import { ConfigService } from '@nestjs/config';
import { LogbooksService } from './logbooks.service';
import { LogbooksRepository } from './logbooks.repository';
import { Readable } from 'stream';
import { MinioConfigService } from '../../config/storage/minio-client/config.service';
import { MinioProviderService } from '../../providers/storage/minio/minio.service';
import { MinioService } from 'nestjs-minio-client';

const mockLogbooksRepository = () => ({
  createLogbook: jest.fn(),
});

const mockMinioProviderService = () => ({
  upload: jest.fn(),
});

const mockUser: User = {
  id: 'someId',
  name: 'someUsername',
  email: 'someEmail',
  password: 'somePassword',
  hashPassword: jest.fn(),
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
  daysoff: null,
  logbooks: [],
  attendances: [],
  isActive: false,
  userProfile: null,
  userSocialAccounts: [],
  userTokens: [],
};

const mockLogbook = {
  id: 'someId',
  projectId: 'someProjectId',
  mainDutyId: 'someMainDutyId',
  userId: 'someUserId',
  nameTask: 'someNameTask',
  dateTask: new Date(),
  evidenceTaskUrl: 'someEvidenceTaskUrl',
  evidenceTaskPath: 'someEvidenceTaskPath',
  linkAttachment: 'someLinkAttachment',
  workplace: 'someWorkplace',
  organizer: 'someOrganizer',
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
  user: {
    id: 'someId',
  },
};

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

describe('LogbooksService', () => {
  let minioProviderService: MinioProviderService;
  let logbooksService: LogbooksService;
  let logbooksRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        AppConfigService,
        MinioConfigService,
        LogbooksService,
        {
          provide: MinioProviderService,
          useFactory: mockMinioProviderService,
        },
        {
          provide: MinioService,
          useValue: {
            putObject: jest.fn(),
          },
        },
        {
          provide: LogbooksRepository,
          useFactory: mockLogbooksRepository,
        },
      ],
    }).compile();

    minioProviderService = await module.get(MinioProviderService);
    logbooksService = await module.get(LogbooksService);
    logbooksRepository = await module.get(LogbooksRepository);
  });

  describe('createLogbook', () => {
    it('should return logbook', async () => {
      (minioProviderService.upload as jest.Mock).mockReturnValue(
        Promise.resolve({
          url: 'someUrl',
          path: 'somePath',
        }),
      );

      await logbooksRepository.createLogbook.mockResolvedValue(mockLogbook);

      const logbook = await logbooksService.createLogbook(
        mockUser,
        {
          project_id: 'someProjectId',
          main_duty_id: 'someMainDutyId',
          name_task: 'someNameTask',
          partner: [],
          date_task: new Date(),
          link_attachment: 'someLinkAttachment',
          workplace: 'someWorkplace',
          organizer: 'someOrganizer',
        },
        mockImage,
      );

      expect(typeof logbook).toBe('object');

      expect(logbook).toHaveProperty('projectId', 'someProjectId');
      expect(logbook).toHaveProperty('mainDutyId', 'someMainDutyId');
      expect(logbook).toHaveProperty('nameTask', 'someNameTask');
      expect(logbook).toHaveProperty('dateTask');
      expect(logbook).toHaveProperty('evidenceTaskUrl');
      expect(logbook).toHaveProperty('evidenceTaskPath');
      expect(logbook).toHaveProperty('linkAttachment', 'someLinkAttachment');
      expect(logbook).toHaveProperty('workplace', 'someWorkplace');
      expect(logbook).toHaveProperty('organizer', 'someOrganizer');

      expect(logbook).toHaveProperty('user');
      expect(logbook.user).toHaveProperty('id');
    });
  });
});
