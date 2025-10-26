import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTasksController } from './GetAllTasks.controller';
import { GetAllTasksUseCase } from '../../../application/useCase/GetAllTasks/GetAllTasksUseCase';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/JwtAuth.guard';
import { GetAllTasksQueryDto } from './GetAllTasksQuery.dto';
import { Task } from '../../../domain/entity/Task.entity';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('GetAllTasksController', () => {
  let controller: GetAllTasksController;
  let getAllTasksUseCase: jest.Mocked<GetAllTasksUseCase>;

  const mockTasks = [
    new Task(
      1,
      new Date('2024-01-01T10:00:00.000Z'),
      new Date('2024-01-01T10:00:00.000Z'),
      'Test Task 1',
      'Test Description 1',
      false,
    ),
    new Task(
      2,
      new Date('2024-01-02T10:00:00.000Z'),
      new Date('2024-01-02T10:00:00.000Z'),
      'Test Task 2',
      'Test Description 2',
      true,
    ),
  ];

  const expectedResponse: ITaskResponse[] = [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'Test Description 1',
      completed: false,
      createdAt: new Date('2024-01-01T10:00:00.000Z'),
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Test Description 2',
      completed: true,
      createdAt: new Date('2024-01-02T10:00:00.000Z'),
    },
  ];

  beforeEach(async () => {
    const mockGetAllTasksUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllTasksController],
      providers: [
        {
          provide: GetAllTasksUseCase,
          useValue: mockGetAllTasksUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<GetAllTasksController>(GetAllTasksController);
    getAllTasksUseCase = module.get(GetAllTasksUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should get all tasks successfully', async () => {
      // Arrange
      const query: GetAllTasksQueryDto = {};
      const spyOnUseCase =
        getAllTasksUseCase.execute.mockResolvedValue(mockTasks);

      // Act
      const result = await controller.handle(query);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when use case fails', async () => {
      // Arrange
      const query: GetAllTasksQueryDto = {};
      const errorMessage = 'Failed to get all tasks';
      const spyOnUseCase = getAllTasksUseCase.execute.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(controller.handle(query)).rejects.toThrow(errorMessage);
      expect(spyOnUseCase).toHaveBeenCalledWith(query);
    });

    it('should handle completed filter with boolean true', async () => {
      // Arrange
      const query: GetAllTasksQueryDto = { completed: true };
      const spyOnUseCase = getAllTasksUseCase.execute.mockResolvedValue([
        mockTasks[1],
      ]);

      // Act
      await controller.handle(query);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledWith(
        expect.objectContaining({ completed: true }),
      );
    });

    it('should handle completed filter with boolean false', async () => {
      // Arrange
      const query: GetAllTasksQueryDto = { completed: false };
      const spyOnUseCase = getAllTasksUseCase.execute.mockResolvedValue([
        mockTasks[0],
      ]);

      // Act
      await controller.handle(query);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledWith(
        expect.objectContaining({ completed: false }),
      );
    });

    it('should return empty array when no tasks found', async () => {
      // Arrange
      const query: GetAllTasksQueryDto = {};
      getAllTasksUseCase.execute.mockResolvedValue([]);

      // Act
      const result = await controller.handle(query);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('DTO Transformation Coverage', () => {
    it('should handle string "true" transformation', async () => {
      // Arrange
      const dto = plainToInstance(GetAllTasksQueryDto, { completed: 'true' });
      const spyOnUseCase =
        getAllTasksUseCase.execute.mockResolvedValue(mockTasks);

      // Act
      await controller.handle(dto);

      // Assert - DTO should transform string "true" to boolean true
      expect(spyOnUseCase).toHaveBeenCalledWith(
        expect.objectContaining({ completed: true }),
      );
    });

    it('should handle string "false" transformation', async () => {
      // Arrange
      const dto = plainToInstance(GetAllTasksQueryDto, { completed: 'false' });
      const spyOnUseCase =
        getAllTasksUseCase.execute.mockResolvedValue(mockTasks);

      // Act
      await controller.handle(dto);

      // Assert - DTO should transform string "false" to boolean false
      expect(spyOnUseCase).toHaveBeenCalledWith(
        expect.objectContaining({ completed: false }),
      );
    });

    it('should handle empty string as undefined', async () => {
      // Arrange
      const dto = plainToInstance(GetAllTasksQueryDto, { completed: '' });
      const spyOnUseCase =
        getAllTasksUseCase.execute.mockResolvedValue(mockTasks);

      // Act
      await controller.handle(dto);

      // Assert - Empty string should be transformed to undefined
      expect(spyOnUseCase).toHaveBeenCalledWith(
        expect.objectContaining({ completed: undefined }),
      );
    });

    it('should validate invalid values through class-validator', async () => {
      // Arrange
      const dto = plainToInstance(GetAllTasksQueryDto, {
        completed: 'invalid',
      });

      // Act & Assert - Invalid values should fail validation
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('completed');
      expect(errors[0].constraints?.isIn).toContain(
        'Completed must be true or false',
      );
    });
  });
});
