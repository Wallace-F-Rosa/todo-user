import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('valid task', async () => {
      const task = {
        name: 'testTask',
        description: 'Test description',
      };
      const createdTask = service.create(task);
      expect(createdTask).toMatchObject(createdTask);
    });

    it('missing fields', async () => {
      const task = {
        name: 'testTask',
      };
      const createdTask = service.create(task);
      expect(createdTask).toBeInstanceOf(Error);
    });

    it('invalid fields', async () => {
      const task = {
        name: 1,
        description: {},
      };
      const createdTask = service.create(task);
      expect(createdTask).toBeInstanceOf(Error);
    });
  });
});
