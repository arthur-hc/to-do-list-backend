import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteTaskUseCase } from './DeleteTaskUseCase';
import {
  ITaskRepository,
  ITaskRepositoryToken,
} from '../../../domain/interfaces/ITask.repository';
import { Task } from '../../../domain/entity/Task.entity';

describe('DeleteTaskUseCase', () => {
  let useCase: DeleteTaskUseCase;
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
        DeleteTaskUseCase,
        {
          provide: ITaskRepositoryToken,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
    taskRepository =
      module.get<jest.Mocked<ITaskRepository>>(ITaskRepositoryToken);
  });

  it('should delete task successfully', async () => {
    // Arrange
    const input = { id: 1 };

    const existingTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      false,
    );

    const findByIdSpy = jest
      .spyOn(taskRepository, 'findById')
      .mockResolvedValue(existingTask);
    const deleteSpy = jest
      .spyOn(taskRepository, 'delete')
      .mockResolvedValue(undefined);

    // Act
    await useCase.execute(input);

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when task does not exist', async () => {
    // Arrange
    const input = { id: 999 };

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(null);
    const deleteSpy = jest.spyOn(taskRepository, 'delete');

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(input)).rejects.toThrow(
      'Task with ID 999 not found',
    );
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails on findById', async () => {
    // Arrange
    const input = { id: 1 };

    jest
      .spyOn(taskRepository, 'findById')
      .mockRejectedValue(new Error('Database error'));
    const deleteSpy = jest.spyOn(taskRepository, 'delete');

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Database error');
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails on delete', async () => {
    // Arrange
    const input = { id: 1 };

    const existingTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      false,
    );

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(existingTask);
    jest
      .spyOn(taskRepository, 'delete')
      .mockRejectedValue(new Error('Delete failed'));

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Delete failed');
  });
});
