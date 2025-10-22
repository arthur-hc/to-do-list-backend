import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { GetTaskByIdUseCase } from './GetTaskByIdUseCase';
import {
  ITaskRepository,
  ITaskRepositoryToken,
} from '../../../domain/interfaces/ITask.repository';
import { Task } from '../../../domain/entity/Task.entity';

describe('GetTaskByIdUseCase', () => {
  let useCase: GetTaskByIdUseCase;
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
        GetTaskByIdUseCase,
        {
          provide: ITaskRepositoryToken,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    useCase = module.get<GetTaskByIdUseCase>(GetTaskByIdUseCase);
    taskRepository =
      module.get<jest.Mocked<ITaskRepository>>(ITaskRepositoryToken);
  });

  it('should return task when found by ID', async () => {
    // Arrange
    const id = 1;

    const mockTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      false,
    );

    const findByIdSpy = jest
      .spyOn(taskRepository, 'findById')
      .mockResolvedValue(mockTask);

    // Act
    const result = await useCase.execute(id);

    // Assert
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockTask);
  });

  it('should throw NotFoundException when task is not found', async () => {
    // Arrange
    const id = 999;

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(id)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(id)).rejects.toThrow(
      'Task with ID 999 not found',
    );
  });

  it('should throw error when repository fails', async () => {
    // Arrange
    const id = 1;

    jest
      .spyOn(taskRepository, 'findById')
      .mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute(id)).rejects.toThrow('Database error');
  });
});
