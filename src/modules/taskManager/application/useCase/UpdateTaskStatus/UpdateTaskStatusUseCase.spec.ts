import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskStatusUseCase } from './UpdateTaskStatusUseCase';
import {
  ITaskRepository,
  ITaskRepositoryToken,
} from '../../../domain/interfaces/ITask.repository';
import { Task } from '../../../domain/entity/Task.entity';

describe('UpdateTaskStatusUseCase', () => {
  let useCase: UpdateTaskStatusUseCase;
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
        UpdateTaskStatusUseCase,
        {
          provide: ITaskRepositoryToken,
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    useCase = module.get<UpdateTaskStatusUseCase>(UpdateTaskStatusUseCase);
    taskRepository =
      module.get<jest.Mocked<ITaskRepository>>(ITaskRepositoryToken);
  });

  it('should toggle task status from false to true', async () => {
    // Arrange
    const taskId = 1;

    const existingTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      false,
    );

    const updatedTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      true,
    );

    const findByIdSpy = jest
      .spyOn(taskRepository, 'findById')
      .mockResolvedValue(existingTask);
    const updateSpy = jest
      .spyOn(taskRepository, 'update')
      .mockResolvedValue(updatedTask);

    // Act
    const result = await useCase.execute(taskId);

    // Assert
    expect(findByIdSpy).toHaveBeenCalledWith(1);
    expect(updateSpy).toHaveBeenCalledWith(existingTask);
    expect(existingTask.completed).toBe(true); // Status foi invertido no objeto
    expect(result).toEqual(updatedTask);
    expect(result.completed).toBe(true);
  });

  it('should toggle task status from true to false', async () => {
    // Arrange
    const taskId = 1;

    const existingTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      true,
    );

    const updatedTask = new Task(
      1,
      new Date(),
      new Date(),
      'Test Task',
      'Test Description',
      false,
    );

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(existingTask);
    const updateSpy = jest
      .spyOn(taskRepository, 'update')
      .mockResolvedValue(updatedTask);

    // Act
    const result = await useCase.execute(taskId);

    // Assert
    expect(updateSpy).toHaveBeenCalledWith(existingTask);
    expect(existingTask.completed).toBe(false); // Status foi invertido no objeto
    expect(result.completed).toBe(false);
  });

  it('should throw NotFoundException when task does not exist', async () => {
    // Arrange
    const taskId = 999;

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(null);
    const updateSpy = jest.spyOn(taskRepository, 'update');

    // Act & Assert
    await expect(useCase.execute(taskId)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute(taskId)).rejects.toThrow(
      'Task with ID 999 not found',
    );
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails on findById', async () => {
    // Arrange
    const taskId = 1;

    jest
      .spyOn(taskRepository, 'findById')
      .mockRejectedValue(new Error('Database error'));
    const updateSpy = jest.spyOn(taskRepository, 'update');

    // Act & Assert
    await expect(useCase.execute(taskId)).rejects.toThrow('Database error');
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it('should throw error when repository fails on update', async () => {
    // Arrange
    const taskId = 1;

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
      .spyOn(taskRepository, 'update')
      .mockRejectedValue(new Error('Update failed'));

    // Act & Assert
    await expect(useCase.execute(taskId)).rejects.toThrow('Update failed');
  });
});
