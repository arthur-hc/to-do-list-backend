import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTasksUseCase } from './GetAllTasksUseCase';
import {
  ITaskRepository,
  ITaskRepositoryToken,
} from '../../../domain/interfaces/ITask.repository';
import { Task } from '../../../domain/entity/Task.entity';
import { GetAllTasksInput } from './IGetAllTasksInput';

describe('GetAllTasksUseCase', () => {
  let useCase: GetAllTasksUseCase;
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
        GetAllTasksUseCase,
        {
          provide: ITaskRepositoryToken,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetAllTasksUseCase>(GetAllTasksUseCase);
    taskRepository =
      module.get<jest.Mocked<ITaskRepository>>(ITaskRepositoryToken);
  });

  it('should return all tasks when no filter is provided', async () => {
    // Arrange
    const input: GetAllTasksInput = {};

    const mockTasks = [
      new Task(1, new Date(), new Date(), 'Task 1', 'Description 1', false),
      new Task(2, new Date(), new Date(), 'Task 2', 'Description 2', true),
    ];

    const findAllSpy = jest
      .spyOn(taskRepository, 'findAll')
      .mockResolvedValue(mockTasks);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy).toHaveBeenCalledWith({});
    expect(result).toEqual(mockTasks);
    expect(result).toHaveLength(2);
  });

  it('should return only completed tasks when completed=true', async () => {
    // Arrange
    const input: GetAllTasksInput = { completed: true };

    const mockTasks = [
      new Task(2, new Date(), new Date(), 'Task 2', 'Description 2', true),
    ];

    const findAllSpy = jest
      .spyOn(taskRepository, 'findAll')
      .mockResolvedValue(mockTasks);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy).toHaveBeenCalledWith({ completed: true });
    expect(result).toEqual(mockTasks);
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(true);
  });

  it('should return only incomplete tasks when completed=false', async () => {
    // Arrange
    const input: GetAllTasksInput = { completed: false };

    const mockTasks = [
      new Task(1, new Date(), new Date(), 'Task 1', 'Description 1', false),
    ];

    const findAllSpy = jest
      .spyOn(taskRepository, 'findAll')
      .mockResolvedValue(mockTasks);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(findAllSpy).toHaveBeenCalledTimes(1);
    expect(findAllSpy).toHaveBeenCalledWith({ completed: false });
    expect(result).toEqual(mockTasks);
    expect(result).toHaveLength(1);
    expect(result[0].completed).toBe(false);
  });

  it('should return empty array when no tasks exist', async () => {
    // Arrange
    const input: GetAllTasksInput = {};

    jest.spyOn(taskRepository, 'findAll').mockResolvedValue([]);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
