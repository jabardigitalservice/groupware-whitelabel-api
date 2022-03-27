import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';

const mockProjectsRepository = () => ({
  getProjects: jest.fn(),
});

const mockProjects = [
  {
    id: 'fc0b9630-1a36-48fd-a5d5-e49be903aa31',
    name: 'Digiteam',
    description: null,
  },
  {
    id: 'fc0b9630-1a36-48fd-a5d5-e49be904vv23',
    name: 'Pikobar',
    description: null,
  },
];

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: ProjectsRepository, useFactory: mockProjectsRepository },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get<ProjectsRepository>(ProjectsRepository);
  });

  describe('getProjects', () => {
    it('should return a list of projects', async () => {
      repository.getProjects.mockResolvedValue(mockProjects);

      const result = await service.getProjects(null);
      expect(result).toEqual(mockProjects);
    });

    it('should return an empty list of projects', async () => {
      repository.getProjects.mockResolvedValue([]);

      const searchName = {
        name: 'Not Exist Project',
      };
      const result = await service.getProjects(searchName);
      expect(result).toEqual([]);
    });
  });
});
