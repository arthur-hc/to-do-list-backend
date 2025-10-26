import { Test, TestingModule } from '@nestjs/testing';
import { UpdateTaskStatusController } from './UpdateTaskStatus.controller';
import { UpdateTaskStatusUseCase } from '../../../application/useCase/UpdateTaskStatus/UpdateTaskStatusUseCase';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/JwtAuth.guard';
import { UpdateTaskStatusParamsDto } from './UpdateTaskStatusParams.dto';
import { Task } from '../../../domain/entity/Task.entity';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { plainToInstance } from 'class-transformer';

describe('UpdateTaskStatusController', () => {
  let controller: UpdateTaskStatusController;
  let updateTaskStatusUseCase: jest.Mocked<UpdateTaskStatusUseCase>;

  const mockUpdatedTask = new Task(
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T11:00:00.000Z'),
    'Test Task',
    'Test Description',
    true,
  );

  const expectedResponse: ITaskResponse = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: true,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
  };

  beforeEach(async () => {
    const mockUpdateTaskStatusUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateTaskStatusController],
      providers: [
        {
          provide: UpdateTaskStatusUseCase,
          useValue: mockUpdateTaskStatusUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<UpdateTaskStatusController>(
      UpdateTaskStatusController,
    );
    updateTaskStatusUseCase = module.get(UpdateTaskStatusUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should update task status successfully', async () => {
      // Arrange
      const updateTaskStatusParams: UpdateTaskStatusParamsDto = {
        id: 1,
      };

      const spyOnUseCase =
        updateTaskStatusUseCase.execute.mockResolvedValue(mockUpdatedTask);

      // Act
      const result = await controller.handle(updateTaskStatusParams);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledTimes(1);
      expect(spyOnUseCase).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should return the updated task in the correct format', async () => {
      // Arrange
      const updateTaskStatusParams: UpdateTaskStatusParamsDto = {
        id: 2,
      };

      const anotherUpdatedTask = new Task(
        2,
        new Date('2024-01-02T10:00:00.000Z'),
        new Date('2024-01-02T11:00:00.000Z'),
        'Another Task',
        'Another Description',
        false,
      );

      updateTaskStatusUseCase.execute.mockResolvedValue(anotherUpdatedTask);

      // Act
      const result = await controller.handle(updateTaskStatusParams);

      // Assert
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('title', 'Another Task');
      expect(result).toHaveProperty('description', 'Another Description');
      expect(result).toHaveProperty('completed', false);
      expect(result).toHaveProperty('createdAt');
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when use case fails', async () => {
      // Arrange
      const updateTaskStatusParams: UpdateTaskStatusParamsDto = {
        id: 1,
      };

      const errorMessage = 'Failed to update task status';
      const spyOnUseCase = updateTaskStatusUseCase.execute.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(controller.handle(updateTaskStatusParams)).rejects.toThrow(
        errorMessage,
      );
      expect(spyOnUseCase).toHaveBeenCalledWith(1);
    });

    it('should pass the correct id parameter to use case', async () => {
      // Arrange
      const updateTaskStatusParams: UpdateTaskStatusParamsDto = {
        id: 42,
      };

      const spyOnUseCase =
        updateTaskStatusUseCase.execute.mockResolvedValue(mockUpdatedTask);

      // Act
      await controller.handle(updateTaskStatusParams);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledWith(42);
    });

    it('should handle different task IDs correctly', async () => {
      // Arrange
      const testCases = [{ id: 1 }, { id: 100 }, { id: 999 }];

      const spyOnUseCase =
        updateTaskStatusUseCase.execute.mockResolvedValue(mockUpdatedTask);

      // Act & Assert
      for (const testCase of testCases) {
        const updateTaskStatusParams: UpdateTaskStatusParamsDto = testCase;

        await controller.handle(updateTaskStatusParams);

        expect(spyOnUseCase).toHaveBeenCalledWith(testCase.id);
      }

      expect(spyOnUseCase).toHaveBeenCalledTimes(3);
    });

    it('should toggle task status from false to true', async () => {
      // Arrange
      const updateTaskStatusParams: UpdateTaskStatusParamsDto = {
        id: 1,
      };

      // Task is initially incomplete (false), after update it becomes complete (true)
      updateTaskStatusUseCase.execute.mockResolvedValue(mockUpdatedTask);

      // Act
      const result = await controller.handle(updateTaskStatusParams);

      // Assert
      expect(result.completed).toBe(true);
    });

    it('should toggle task status from true to false', async () => {
      // Arrange
      const updateTaskStatusParams: UpdateTaskStatusParamsDto = {
        id: 1,
      };

      // Task is initially complete (true), after update it becomes incomplete (false)
      const toggledTask = new Task(
        1,
        new Date('2024-01-01T10:00:00.000Z'),
        new Date('2024-01-01T11:00:00.000Z'),
        'Test Task',
        'Test Description',
        false,
      );

      updateTaskStatusUseCase.execute.mockResolvedValue(toggledTask);

      // Act
      const result = await controller.handle(updateTaskStatusParams);

      // Assert
      expect(result.completed).toBe(false);
    });
  });

  describe('DTO Transformation Coverage', () => {
    it('should transform string id to number', async () => {
      // Arrange
      const dto = plainToInstance(UpdateTaskStatusParamsDto, { id: '456' });
      const spyOnUseCase =
        updateTaskStatusUseCase.execute.mockResolvedValue(mockUpdatedTask);

      // Act
      await controller.handle(dto);

      // Assert - String "456" should be transformed to number 456
      expect(spyOnUseCase).toHaveBeenCalledWith(456);
    });
  });
});
