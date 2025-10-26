import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskController } from './CreateTask.controller';
import { CreateTaskUseCase } from '../../../application/useCase/CreateTask/CreateTaskUseCase';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/JwtAuth.guard';
import { CreateTaskBodyDto } from './CreateTaskBody.dto';
import { Task } from '../../../domain/entity/Task.entity';
import { TaskPresenter } from '../../presenter/Task.presenter';
import { ITaskResponse } from '../../presenter/ITaskResponse';

describe('CreateTaskController', () => {
  let controller: CreateTaskController;
  let createTaskUseCase: jest.Mocked<CreateTaskUseCase>;

  const mockTask = new Task(
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
    'Test Task',
    'Test Description',
    false,
  );

  const expectedResponse: ITaskResponse = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockCreateTaskUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateTaskController],
      providers: [
        {
          provide: CreateTaskUseCase,
          useValue: mockCreateTaskUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<CreateTaskController>(CreateTaskController);
    createTaskUseCase = module.get(CreateTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should create a task successfully', async () => {
      const createTaskBody: CreateTaskBodyDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const spyOnUseCase =
        createTaskUseCase.execute.mockResolvedValue(mockTask);

      const result = await controller.handle(createTaskBody);

      expect(spyOnUseCase).toHaveBeenCalledTimes(1);
      expect(spyOnUseCase).toHaveBeenCalledWith(createTaskBody);
      expect(result).toEqual(expectedResponse);
    });

    it('should return the task in the correct format', async () => {
      const createTaskBody: CreateTaskBodyDto = {
        title: 'Another Task',
        description: 'Another Description',
      };

      const anotherMockTask = new Task(
        2,
        new Date('2024-01-02T10:00:00.000Z'),
        new Date('2024-01-02T10:00:00.000Z'),
        'Another Task',
        'Another Description',
        false,
      );

      createTaskUseCase.execute.mockResolvedValue(anotherMockTask);

      const result = await controller.handle(createTaskBody);

      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('title', 'Another Task');
      expect(result).toHaveProperty('description', 'Another Description');
      expect(result).toHaveProperty('completed', false);
      expect(result).toHaveProperty('createdAt');
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when use case fails', async () => {
      const createTaskBody: CreateTaskBodyDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const errorMessage = 'Failed to create task';
      const spyOnUseCase = createTaskUseCase.execute.mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(controller.handle(createTaskBody)).rejects.toThrow(
        errorMessage,
      );
      expect(spyOnUseCase).toHaveBeenCalledWith(createTaskBody);
    });

    it('should pass the correct parameters to use case', async () => {
      const createTaskBody: CreateTaskBodyDto = {
        title: 'Specific Task Title',
        description: 'Specific Task Description',
      };

      const spyOnUseCase =
        createTaskUseCase.execute.mockResolvedValue(mockTask);

      await controller.handle(createTaskBody);

      expect(spyOnUseCase).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Specific Task Title',
          description: 'Specific Task Description',
        }),
      );
    });
  });

  describe('Task Presenter Integration', () => {
    it('should use TaskPresenter to format response', async () => {
      const createTaskBody: CreateTaskBodyDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      createTaskUseCase.execute.mockResolvedValue(mockTask);

      const presentSpy = jest.spyOn(TaskPresenter, 'present');

      await controller.handle(createTaskBody);

      expect(presentSpy).toHaveBeenCalledTimes(1);
      expect(presentSpy).toHaveBeenCalledWith(mockTask);

      presentSpy.mockRestore();
    });

    it('should return response matching ITaskResponse interface', async () => {
      const createTaskBody: CreateTaskBodyDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      createTaskUseCase.execute.mockResolvedValue(mockTask);

      const result = await controller.handle(createTaskBody);

      expect(typeof result.id).toBe('number');
      expect(typeof result.title).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(typeof result.completed).toBe('boolean');
      expect(result.createdAt).toBeInstanceOf(Date);
    });
  });
});
