import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@sentry/types';
import { MainDutiesRepository } from './main-duties.repository';
import { MainDutiesService } from './main-duties.service';

const mockMainDutiesRepository = () => ({
  getMainDutyByJobTitleId: jest.fn(),
});

const mockMainDuties = [
  {
    id: '6dd30e66-9d06-4460-aaa4-fddd3fddcaa5',
    name: 'Peer Code',
    sequence: 1,
  },
  {
    id: 'c0628524-4ce7-4617-bf67-d05e2e076511',
    name: 'Deploy Server',
    sequence: 2,
  },
];

describe('MainDutiesService', () => {
  let service: MainDutiesService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MainDutiesService,
        { provide: MainDutiesRepository, useFactory: mockMainDutiesRepository },
      ],
    }).compile();

    service = module.get<MainDutiesService>(MainDutiesService);
    repository = module.get<MainDutiesRepository>(MainDutiesRepository);
  });

  describe('getMainDutyByJobTitleId', () => {
    it('should return a list of main duties', async () => {
      repository.getMainDutyByJobTitleId.mockResolvedValue(mockMainDuties);
      const idJobTitle: User = {
        id: '6dd30e66-9d06-4460-aaa4-fddd3fddcaa5',
      };

      const result = await service.getMainDutyByJobTitleId(idJobTitle);
      expect(result).toEqual(mockMainDuties);
    });
  });
});
