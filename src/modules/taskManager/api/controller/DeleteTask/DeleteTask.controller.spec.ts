import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTaskController } from './DeleteTask.controller';
import { DeleteTaskUseCase } from '../../../application/useCase/DeleteTask/DeleteTaskUseCase';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/JwtAuth.guard';
import { DeleteTaskParamsDto } from './DeleteTaskParams.dto';
import { plainToInstance } from 'class-transformer';

describe('DeleteTaskController', () => {
  let controller: DeleteTaskController;
  let deleteTaskUseCase: jest.Mocked<DeleteTaskUseCase>;

  beforeEach(async () => {
    const mockDeleteTaskUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteTaskController],
      providers: [
        {
          provide: DeleteTaskUseCase,
          useValue: mockDeleteTaskUseCase,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<DeleteTaskController>(DeleteTaskController);
    deleteTaskUseCase = module.get(DeleteTaskUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should delete a task successfully', async () => {
      // Arrange
      const deleteTaskParams: DeleteTaskParamsDto = {
        id: 1,
      };

      const spyOnUseCase =
        deleteTaskUseCase.execute.mockResolvedValue(undefined);

      // Act
      const result = await controller.handle(deleteTaskParams);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledTimes(1);
      expect(spyOnUseCase).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('should call use case with correct id parameter', async () => {
      // Arrange
      const deleteTaskParams: DeleteTaskParamsDto = {
        id: 42,
      };

      const spyOnUseCase =
        deleteTaskUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.handle(deleteTaskParams);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledWith(42);
    });

    it('should throw error when use case fails', async () => {
      // Arrange
      const deleteTaskParams: DeleteTaskParamsDto = {
        id: 1,
      };

      const errorMessage = 'Failed to delete task';
      const spyOnUseCase = deleteTaskUseCase.execute.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(controller.handle(deleteTaskParams)).rejects.toThrow(
        errorMessage,
      );
      expect(spyOnUseCase).toHaveBeenCalledWith(1);
    });

    it('should handle different task IDs correctly', async () => {
      // Arrange
      const testCases = [{ id: 1 }, { id: 100 }, { id: 999 }];

      const spyOnUseCase =
        deleteTaskUseCase.execute.mockResolvedValue(undefined);

      // Act & Assert
      for (const testCase of testCases) {
        const deleteTaskParams: DeleteTaskParamsDto = testCase;

        await controller.handle(deleteTaskParams);

        expect(spyOnUseCase).toHaveBeenCalledWith(testCase.id);
      }

      expect(spyOnUseCase).toHaveBeenCalledTimes(3);
    });

    it('should not return any value when deletion is successful', async () => {
      // Arrange
      const deleteTaskParams: DeleteTaskParamsDto = {
        id: 1,
      };

      deleteTaskUseCase.execute.mockResolvedValue(undefined);

      // Act
      const result = await controller.handle(deleteTaskParams);

      // Assert
      expect(result).toBeUndefined();
      expect(typeof result).toBe('undefined');
    });
  });

  describe('DTO Transformation Coverage', () => {
    it('should transform string id to number', async () => {
      // Arrange
      const dto = plainToInstance(DeleteTaskParamsDto, { id: '789' });
      const spyOnUseCase =
        deleteTaskUseCase.execute.mockResolvedValue(undefined);

      // Act
      await controller.handle(dto);

      // Assert - String "789" should be transformed to number 789
      expect(spyOnUseCase).toHaveBeenCalledWith(789);
    });
  });
});
