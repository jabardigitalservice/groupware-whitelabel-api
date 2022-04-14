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
import { GetLogbooksFilterDto } from './dto/get-logbook-filter.dto';

const mockLogbooksRepository = () => ({
  createLogbook: jest.fn(),
  getLogbookByUserId: jest.fn(),
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

const mockLogbooks = [
  {
    logbook_id: 'ae0185b0-8314-4c7a-9083-94ed0c66435a',
    logbook_project_id: '027fd55c-f14e-4d11-abbb-4fa784f964b5',
    logbook_main_duty_id: '017b9138-223d-4ddd-8162-95cefa1da151',
    logbook_user_id: 'a843d4ed-a97c-44c8-8831-24b4eb769139',
    logbook_name_task: 'Test',
    logbook_date_task: '2022-03-31T18:00:00.000Z',
    logbook_evidence_task_path: '8WWTW1lsLHFRr2BLhbYX5egWuvp1mY.png',
    logbook_link_attachment: 'https://google.com',
    logbook_workplace: 'Home',
    logbook_organizer: 'JDS',
    logbook_created_at: '2022-04-12T23:07:05.620Z',
    logbook_updated_at: '2022-04-12T23:07:05.620Z',
    logbook_deleted_at: null,
  },
  {
    logbook_id: '09d99213-902c-4b9f-a61f-f3c9f5de248e',
    logbook_project_id: '027fd55c-f14e-4d11-abbb-4fa784f964b5',
    logbook_main_duty_id: '017b9138-223d-4ddd-8162-95cefa1da151',
    logbook_user_id: 'a843d4ed-a97c-44c8-8831-24b4eb769139',
    logbook_name_task: 'Test',
    logbook_date_task: '2022-03-31T18:00:00.000Z',
    logbook_evidence_task_path: 'poub9iTwgyqDTJ3bomlTKiS6VT1wuU.png',
    logbook_link_attachment: 'https://google.com',
    logbook_workplace: 'Home',
    logbook_organizer: 'JDS',
    logbook_created_at: '2022-04-13T20:47:44.132Z',
    logbook_updated_at: '2022-04-13T20:47:44.132Z',
    logbook_deleted_at: null,
  },
];

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

  describe('getLogbookByUserId', () => {
    it('should return a list of logbooks', async () => {
      logbooksRepository.getLogbookByUserId.mockResolvedValue(mockLogbooks);

      let getLogbooksFilterDto: GetLogbooksFilterDto;

      const result = await logbooksService.getLogbookByUserId(
        mockUser,
        getLogbooksFilterDto,
      );
      expect(result).toEqual(mockLogbooks);
    });
  });
});
