import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskUseCase } from './CreateTaskUseCase';
import {
  ITaskRepository,
  ITaskRepositoryToken,
} from '../../../domain/interfaces/ITask.repository';
import { Task } from '../../../domain/entity/Task.entity';
import { CreateTaskInput } from './ICreateTaskInput';

describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let taskRepository: jest.Mocked<ITaskRepository>;

  beforeEach(async () => {
    const mockTaskRepository: jest.Mocked<ITaskRepository> = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: ITaskRepositoryToken,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
    taskRepository =
      module.get<jest.Mocked<ITaskRepository>>(ITaskRepositoryToken);
  });

  it('should create a new task successfully', async () => {
    // Arrange
    const input: CreateTaskInput = {
      title: 'Test Task',
      description: 'Test Description',
    };

    const expectedTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      false,
    );

    const createSpy = jest
      .spyOn(taskRepository, 'create')
      .mockResolvedValue(expectedTask);

    const result = await useCase.execute(input);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      }),
    );
    expect(result).toEqual(expectedTask);
  });
});
