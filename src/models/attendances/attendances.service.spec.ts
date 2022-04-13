import { Test } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { AttendancesRepository } from './attendances.repository';
import { User } from '../users/entities/user.entity';
import { Mood } from './enums/mood.enums';
import { AppConfigService } from '../../config/app/config.service';
import { ConfigService } from '@nestjs/config';
import { DaysOffRepository } from '../days-off/days-off.repository';
import * as moment from 'moment';
import { PermitsType } from '../days-off/enums/permits-type.enums';

const mockAttendancesRepository = () => ({
  findByNotCheckedOut: jest.fn(),
  findByUserAndToday: jest.fn(),
  isCheckedIn: jest.fn(),
  isCheckedOut: jest.fn(),
  save: jest.fn(),
});

const mockDaysOffRepository = () => ({
  save: jest.fn(),
  findByUserAndToday: jest.fn(),
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

const mockAttendance = {
  id: 'someId',
  startDate: moment(),
  endDate: moment(),
  location: 'someLocation',
  mood: Mood.EXCELLENT,
  note: 'someNote',
  user: {
    id: 'someId',
  },
};

const mockDaysOffAttendance = {
  id: 'someId',
  startDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  officeHours: 0,
  location: '-',
  mood: null,
  note: PermitsType.Sakit,
  user: {
    id: 'someId',
  },
};

const mockDaysOff = {
  id: 'someId',
  startDate: moment().add(-1, 'days').toDate(),
  endDate: moment().toDate(),
  permitsType: PermitsType.Sakit,
  permitAcknowledged: ['somePermitAcknowledged'],
  note: 'someNote',
  filePath: 'someFilePath',
  user: {
    id: 'someId',
  },
};

const mockAttendances = [mockAttendance, mockAttendance, mockAttendance];

const mockAtendanceForCheckOut = {
  id: 'someId',
  startDate: new Date(),
  endDate: null,
  location: 'someLocation',
  mood: Mood.EXCELLENT,
  note: 'someNote',
  user: {
    id: 'someId',
  },
};

describe('AttendancesService', () => {
  let attendancesService: AttendancesService;
  let attendancesRepository: any;
  let daysOffRepository: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        AppConfigService,
        AttendancesService,
        {
          provide: AttendancesRepository,
          useFactory: mockAttendancesRepository,
        },
        {
          provide: DaysOffRepository,
          useFactory: mockDaysOffRepository,
        },
      ],
    }).compile();

    attendancesService = await module.get(AttendancesService);
    attendancesRepository = await module.get(AttendancesRepository);
    daysOffRepository = await module.get(DaysOffRepository);
  });

  describe('checkIn', () => {
    it('should throw error if checkin not today', async () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);

      await expect(
        attendancesService.checkIn(mockUser, {
          date,
          location: 'someLocation',
          mood: Mood.EXCELLENT,
          note: 'someNote',
        }),
      ).rejects.toThrowError();
    });

    it('should throw error if user is already checked in', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(true);

      await expect(
        attendancesService.checkIn(mockUser, {
          date: new Date(),
          location: 'someLocation',
          mood: Mood.EXCELLENT,
          note: 'someNote',
        }),
      ).rejects.toThrowError();
    });

    it('should return attendance if user is not checked in', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(false);
      await attendancesRepository.findByUserAndToday.mockResolvedValue(null);
      await attendancesRepository.save.mockResolvedValue(mockAttendance);

      const attendance = await attendancesService.checkIn(mockUser, {
        date: new Date(),
        location: 'someLocation',
        mood: Mood.EXCELLENT,
        note: 'someNote',
      });

      expect(typeof attendance).toBe('object');

      expect(attendance).toHaveProperty('mood');
      expect(attendance.mood).toBe(Mood.EXCELLENT);

      expect(attendance).toHaveProperty('startDate');
      expect(attendance).toHaveProperty('location');
      expect(attendance).toHaveProperty('note');

      expect(attendance).toHaveProperty('user');
      expect(attendance.user).toHaveProperty('id');
    });
  });

  describe('checkOut', () => {
    it('should throw error if user is not checked in', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(false);

      await expect(
        attendancesService.checkOut(mockUser, {
          date: new Date(),
        }),
      ).rejects.toThrowError();
    });

    it('should throw error if user is already checked out', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(true);
      await attendancesRepository.isCheckedOut.mockResolvedValue(true);

      await expect(
        attendancesService.checkOut(mockUser, {
          date: new Date(),
        }),
      ).rejects.toThrowError();
    });

    it('should return attendance if user is checked in and not checked out', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(true);
      await attendancesRepository.isCheckedOut.mockResolvedValue(false);
      await attendancesRepository.findByUserAndToday.mockResolvedValue(
        mockAtendanceForCheckOut,
      );

      const attendance = await attendancesService.checkOut(mockUser, {
        date: new Date(),
      });

      expect(typeof attendance).toBe('object');

      expect(attendance).toHaveProperty('mood');
      expect(attendance.mood).toBe(Mood.EXCELLENT);

      expect(attendance).toHaveProperty('startDate');
      expect(attendance).toHaveProperty('endDate');
      expect(attendance).toHaveProperty('location');
      expect(attendance).toHaveProperty('note');

      expect(attendance).toHaveProperty('user');
      expect(attendance.user).toHaveProperty('id');
    });
  });

  describe('isTodayAttendance', () => {
    it('should return true if attendance is today', async () => {
      const date = new Date();

      const result = await attendancesService.isTodayAttendance(date);
      expect(result).toBe(true);
    });

    it('should return false if attendance is not today', async () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);

      const result = await attendancesService.isTodayAttendance(date);
      expect(result).toBe(false);
    });
  });

  describe('calculateOfficeHours', () => {
    it('should calculate office hours', async () => {
      const attendance = {
        startDate: new Date('2020-01-01T07:30:00.000Z'),
        endDate: new Date('2020-01-01T16:00:00.000Z'),
      };

      const result = await attendancesService.calculateOfficeHours(attendance);
      expect(result).toEqual(8.5);
    });

    it('should calculate office hours even endDate is next day', async () => {
      const attendance = {
        startDate: new Date('2020-01-01T20:00:00.000Z'),
        endDate: new Date('2020-01-02T06:00:00.000Z'),
      };

      const result = await attendancesService.calculateOfficeHours(attendance);
      expect(result).toEqual(10);
    });

    it('should throw error if startDate is after endDate', async () => {
      const attendance = {
        startDate: new Date('2020-01-01T16:00:00.000Z'),
        endDate: new Date('2020-01-01T07:30:00.000Z'),
      };

      expect(
        attendancesService.calculateOfficeHours(attendance),
      ).rejects.toThrowError();
    });
  });

  describe('isCheckedIn', () => {
    it('should return true if attendance is checked in', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(mockAttendance);

      const result = await attendancesService.isCheckedIn(mockUser);
      expect(result.isCheckedIn).toEqual(true);
      expect(result.date).toEqual(mockAttendance.startDate);
      expect(result.isDaysOff).toEqual(false);
    });

    it('should return true on isCheckedIn and isDaysOff if attendance is checked in and is days off', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(
        mockDaysOffAttendance,
      );
      await daysOffRepository.findByUserAndToday.mockResolvedValue(mockDaysOff);

      const result = await attendancesService.isCheckedIn(mockUser);
      expect(result.isCheckedIn).toEqual(true);
      expect(result.isDaysOff).toEqual(true);
      expect(result.permitsType).toEqual(mockDaysOff.permitsType);
      expect(result.startDate).toEqual(mockDaysOffAttendance.startDate);
      expect(result.endDate).toEqual(mockDaysOffAttendance.endDate);
    });

    it('should return false if attendance is not checked in', async () => {
      await attendancesRepository.isCheckedIn.mockResolvedValue(null);

      const result = await attendancesService.isCheckedIn(mockUser);
      expect(result.isCheckedIn).toEqual(false);
    });
  });

  describe('isCheckedOut', () => {
    it('should return true if attendance is checked out', async () => {
      await attendancesRepository.isCheckedOut.mockResolvedValue(
        mockAttendance,
      );

      const result = await attendancesService.isCheckedOut(mockUser);
      expect(result.isCheckedOut).toEqual(true);
    });

    it('should return false if attendance is not checked out', async () => {
      await attendancesRepository.isCheckedOut.mockResolvedValue(null);

      const result = await attendancesService.isCheckedOut(mockUser);
      expect(result.isCheckedOut).toEqual(false);
    });
  });

  describe('autoCheckOut', () => {
    it('should check out if user is checked in', async () => {
      await attendancesRepository.findByNotCheckedOut.mockResolvedValue(
        mockAttendances,
      );
      await attendancesRepository.save.mockResolvedValue(mockAttendance);

      const result = await attendancesService.autoCheckOut();
      expect(result).toBeUndefined();
    });
  });
});
