import { Test } from '@nestjs/testing';
import { DaysOffService } from './days-off.service';
import { DaysOffRepository } from './days-off.repository';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { MinioProviderService } from '../../providers/storage/minio/minio.service';
import { MinioConfigService } from '../../config/storage/minio-client/config.service';
import { AttendancesService } from '../attendances/attendances.service';
import { MinioService } from 'nestjs-minio-client';
import { AttendancesRepository } from '../attendances/attendances.repository';
import { AppConfigService } from '../../config/app/config.service';
import { PermitsType } from './enums/permits-type.enums';
import * as moment from 'moment';
import { Readable } from 'stream';

const mockConnection = () => ({
  createQueryRunner: () => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  }),
});

const mockMinioProviderService = () => ({
  upload: jest.fn(),
});

const mockDaysOffRepository = () => ({
  save: jest.fn(),
});

const mockAttendancesRepository = () => ({
  save: jest.fn(),
  isAttendanceExist: jest.fn(),
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
  attendances: [],
  daysoff: [],
  isActive: false,
  userProfile: null,
  userSocialAccounts: [],
  userTokens: [],
};

const mockDaysOff = {
  id: 'someId',
  startDate: moment().add(-1, 'days').toDate(),
  endDate: moment().toDate(),
  permitsType: PermitsType.Sakit,
  permitAcknowledged: ['somePermitAcknowledged'],
  note: 'someNote',
  filePath: 'someFilePath',
  fileUrl: 'someFileUrl',
  user: {
    id: 'someId',
  },
};

const mockCreateDaysOffDto = {
  permits_type: PermitsType.Sakit,
  start_date: moment().add(-1, 'days').toDate(),
  end_date: moment().toDate(),
  permit_acknowledged: 'Koordinator,Struktural,HR,Rekan Kerja',
  note: 'someNote',
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

describe('DaysOffService', () => {
  let minioProviderService: MinioProviderService;
  let daysOffService: DaysOffService;
  let daysOffRepository: any;
  let attendancesRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        AppConfigService,
        MinioConfigService,
        DaysOffService,
        AttendancesService,
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
          provide: Connection,
          useFactory: mockConnection,
        },
        {
          provide: DaysOffRepository,
          useFactory: mockDaysOffRepository,
        },
        {
          provide: AttendancesRepository,
          useFactory: mockAttendancesRepository,
        },
      ],
    }).compile();

    minioProviderService = await module.get(MinioProviderService);
    daysOffService = await module.get(DaysOffService);
    daysOffRepository = await module.get(DaysOffRepository);
    attendancesRepository = await module.get(AttendancesRepository);
  });

  describe('createDaysOff', () => {
    it('should create a days off', async () => {
      (minioProviderService.upload as jest.Mock).mockReturnValue(
        Promise.resolve({
          url: 'someUrl',
          path: 'somePath',
        }),
      );

      await daysOffService.createDaysOff(
        mockUser,
        mockCreateDaysOffDto,
        mockImage,
      );

      expect(daysOffRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if the days off is already exist', async () => {
      (attendancesRepository.isAttendanceExist as jest.Mock).mockReturnValue(
        Promise.resolve(true),
      );

      await expect(
        daysOffService.createDaysOff(mockUser, mockCreateDaysOffDto, mockImage),
      ).rejects.toThrowError();
    });
  });

  describe('createAttendanceDaysOff', () => {
    it('should create a attendance days off', async () => {
      const attendances = await daysOffService.createAttendanceDaysOff(
        mockUser,
        mockDaysOff.startDate,
        mockDaysOff.endDate,
        mockDaysOff.permitsType,
      );
      expect(attendances).toBeUndefined();
    });
  });

  describe('isAttendanceExist', () => {
    it('should return true if attendance exist', async () => {
      await attendancesRepository.isAttendanceExist.mockResolvedValue(true);
      const attendance = await daysOffService.isAttendanceExist(
        mockUser,
        mockDaysOff.startDate,
        mockDaysOff.endDate,
      );

      expect(attendance).toBeTruthy();
    });

    it('should return false if attendance not exist', async () => {
      await attendancesRepository.isAttendanceExist.mockResolvedValue(false);
      const attendance = await daysOffService.isAttendanceExist(
        mockUser,
        mockDaysOff.startDate,
        mockDaysOff.endDate,
      );

      expect(attendance).toBeFalsy();
    });
  });
});
