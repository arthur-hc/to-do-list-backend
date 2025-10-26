import { Test, TestingModule } from '@nestjs/testing';
import { GetTaskByIdController } from './GetTaskById.controller';
import { GetTaskByIdUseCase } from '../../../application/useCase/GetTaskById/GetTaskByIdUseCase';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/JwtAuth.guard';
import { GetTaskByIdParamsDto } from './GetTaskByIdParams.dto';
import { Task } from '../../../domain/entity/Task.entity';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { plainToInstance } from 'class-transformer';

describe('GetTaskByIdController', () => {
  let controller: GetTaskByIdController;
  let getTaskByIdUseCase: jest.Mocked<GetTaskByIdUseCase>;

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
    const mockGetTaskByIdUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetTaskByIdController],
      providers: [
        {
          provide: GetTaskByIdUseCase,
          useValue: mockGetTaskByIdUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<GetTaskByIdController>(GetTaskByIdController);
    getTaskByIdUseCase = module.get(GetTaskByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should get a task by id successfully', async () => {
      // Arrange
      const getTaskByIdParams: GetTaskByIdParamsDto = {
        id: 1,
      };

      const spyOnUseCase =
        getTaskByIdUseCase.execute.mockResolvedValue(mockTask);

      // Act
      const result = await controller.handle(getTaskByIdParams);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledTimes(1);
      expect(spyOnUseCase).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should return the task in the correct format', async () => {
      // Arrange
      const getTaskByIdParams: GetTaskByIdParamsDto = {
        id: 2,
      };

      const anotherMockTask = new Task(
        2,
        new Date('2024-01-02T10:00:00.000Z'),
        new Date('2024-01-02T10:00:00.000Z'),
        'Another Task',
        'Another Description',
        true,
      );

      getTaskByIdUseCase.execute.mockResolvedValue(anotherMockTask);

      // Act
      const result = await controller.handle(getTaskByIdParams);

      // Assert
      expect(result).toHaveProperty('id', 2);
      expect(result).toHaveProperty('title', 'Another Task');
      expect(result).toHaveProperty('description', 'Another Description');
      expect(result).toHaveProperty('completed', true);
      expect(result).toHaveProperty('createdAt');
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw error when use case fails', async () => {
      // Arrange
      const getTaskByIdParams: GetTaskByIdParamsDto = {
        id: 1,
      };

      const errorMessage = 'Failed to get task by id';
      const spyOnUseCase = getTaskByIdUseCase.execute.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(controller.handle(getTaskByIdParams)).rejects.toThrow(
        errorMessage,
      );
      expect(spyOnUseCase).toHaveBeenCalledWith(1);
    });

    it('should pass the correct id parameter to use case', async () => {
      // Arrange
      const getTaskByIdParams: GetTaskByIdParamsDto = {
        id: 42,
      };

      const spyOnUseCase =
        getTaskByIdUseCase.execute.mockResolvedValue(mockTask);

      // Act
      await controller.handle(getTaskByIdParams);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledWith(42);
    });

    it('should handle different task IDs correctly', async () => {
      // Arrange
      const testCases = [{ id: 1 }, { id: 100 }, { id: 999 }];

      const spyOnUseCase =
        getTaskByIdUseCase.execute.mockResolvedValue(mockTask);

      // Act & Assert
      for (const testCase of testCases) {
        const getTaskByIdParams: GetTaskByIdParamsDto = testCase;

        await controller.handle(getTaskByIdParams);

        expect(spyOnUseCase).toHaveBeenCalledWith(testCase.id);
      }

      expect(spyOnUseCase).toHaveBeenCalledTimes(3);
    });

    it('should throw error when task not found', async () => {
      // Arrange
      const getTaskByIdParams: GetTaskByIdParamsDto = {
        id: 999,
      };

      const errorMessage = 'Task not found';
      const spyOnUseCase = getTaskByIdUseCase.execute.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(controller.handle(getTaskByIdParams)).rejects.toThrow(
        errorMessage,
      );
      expect(spyOnUseCase).toHaveBeenCalledWith(999);
    });
  });

  describe('DTO Transformation Coverage', () => {
    it('should transform string id to number', async () => {
      // Arrange
      const dto = plainToInstance(GetTaskByIdParamsDto, { id: '123' });
      const spyOnUseCase =
        getTaskByIdUseCase.execute.mockResolvedValue(mockTask);

      // Act
      await controller.handle(dto);

      // Assert - String "123" should be transformed to number 123
      expect(spyOnUseCase).toHaveBeenCalledWith(123);
    });
  });
});
