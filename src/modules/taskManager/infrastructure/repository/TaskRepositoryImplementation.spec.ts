import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TaskRepositoryImplementation } from './TaskRepositoryImplementation';
import { TypeOrmTaskEntity } from '../entity/TypeOrmTask.entity';
import { Task } from '../../domain/entity/Task.entity';
import { TypeOrmTaskEntityMapper } from '../mapper/TypeOrmTaskEntity.mapper';
import { IFindAllTasksFilter } from '../../domain/interfaces/IFindAllTasksFilter';

describe('TaskRepositoryImplementation', () => {
  let repository: TaskRepositoryImplementation;
  let typeOrmRepository: jest.Mocked<Repository<TypeOrmTaskEntity>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<TypeOrmTaskEntity>>;

  // Mock TypeORM Entity
  const mockTypeOrmTask: TypeOrmTaskEntity = {
    id: 1,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-01T10:00:00.000Z'),
    deletedAt: undefined,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
  };

  const anotherMockTypeOrmTask: TypeOrmTaskEntity = {
    id: 2,
    createdAt: new Date('2024-01-02T10:00:00.000Z'),
    updatedAt: new Date('2024-01-02T10:00:00.000Z'),
    deletedAt: undefined,
    title: 'Another Task',
    description: 'Another Description',
    completed: true,
  };

  // Mock Domain Entity
  const mockTask = new Task(
    1,
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
    'Test Task',
    'Test Description',
    false,
  );

  const anotherMockTask = new Task(
    2,
    new Date('2024-01-02T10:00:00.000Z'),
    new Date('2024-01-02T10:00:00.000Z'),
    'Another Task',
    'Another Description',
    true,
  );

  beforeEach(async () => {
    // Create query builder mock
    queryBuilder = {
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    } as unknown as jest.Mocked<SelectQueryBuilder<TypeOrmTaskEntity>>;

    // Create TypeORM Repository mock
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskRepositoryImplementation,
        {
          provide: getRepositoryToken(TypeOrmTaskEntity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<TaskRepositoryImplementation>(
      TaskRepositoryImplementation,
    );
    typeOrmRepository = module.get<jest.Mocked<Repository<TypeOrmTaskEntity>>>(
      getRepositoryToken(TypeOrmTaskEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all tasks successfully', async () => {
      // Arrange
      const mockTasks = [mockTypeOrmTask, anotherMockTypeOrmTask];
      const spyOnQueryBuilder = jest
        .spyOn(typeOrmRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
      const spyOnGetMany = queryBuilder.getMany.mockResolvedValue(mockTasks);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValueOnce(mockTask)
        .mockReturnValueOnce(anotherMockTask);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(spyOnQueryBuilder).toHaveBeenCalledTimes(1);
      expect(spyOnQueryBuilder).toHaveBeenCalledWith('task');
      expect(spyOnGetMany).toHaveBeenCalledTimes(1);
      expect(spyOnMapper).toHaveBeenCalledTimes(2);
      expect(spyOnMapper).toHaveBeenNthCalledWith(1, mockTypeOrmTask);
      expect(spyOnMapper).toHaveBeenNthCalledWith(2, anotherMockTypeOrmTask);
      expect(result).toEqual([mockTask, anotherMockTask]);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should return empty array when no tasks found', async () => {
      // Arrange
      const spyOnGetMany = queryBuilder.getMany.mockResolvedValue([]);
      const spyOnQueryBuilder = jest
        .spyOn(typeOrmRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(spyOnQueryBuilder).toHaveBeenCalledTimes(1);
      expect(spyOnGetMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should filter by completed status when filter is provided', async () => {
      // Arrange
      const filter: IFindAllTasksFilter = { completed: true };
      const completedTasks = [anotherMockTypeOrmTask];
      const spyOnQueryBuilder = jest
        .spyOn(typeOrmRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
      const spyOnGetMany =
        queryBuilder.getMany.mockResolvedValue(completedTasks);

      const spyOnWhere = jest.spyOn(queryBuilder, 'where');

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(anotherMockTask);

      // Act
      const result = await repository.findAll(filter);

      // Assert
      expect(spyOnQueryBuilder).toHaveBeenCalledWith('task');
      expect(spyOnWhere).toHaveBeenCalledTimes(1);
      expect(spyOnWhere).toHaveBeenCalledWith('task.completed = :completed', {
        completed: true,
      });
      expect(spyOnGetMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([anotherMockTask]);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should not apply filter when completed is undefined', async () => {
      // Arrange
      const filter: IFindAllTasksFilter = {};
      jest
        .spyOn(typeOrmRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
      const spyOnWhere = jest.spyOn(queryBuilder, 'where');
      const spyOnGetMany = queryBuilder.getMany.mockResolvedValue([
        mockTypeOrmTask,
      ]);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockTask);

      // Act
      const result = await repository.findAll(filter);

      // Assert
      expect(spyOnWhere).not.toHaveBeenCalled();
      expect(spyOnGetMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockTask]);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      jest
        .spyOn(typeOrmRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.findAll()).rejects.toThrow(errorMessage);
    });
  });

  describe('findById', () => {
    it('should return task when found', async () => {
      // Arrange
      const taskId = 1;
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmTask);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockTask);

      // Act
      const result = await repository.findById(taskId);

      // Assert
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(spyOnMapper).toHaveBeenCalledTimes(1);
      expect(spyOnMapper).toHaveBeenCalledWith(mockTypeOrmTask);
      expect(result).toEqual(mockTask);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should return null when task not found', async () => {
      // Arrange
      const taskId = 999;
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(null);

      // Act
      const result = await repository.findById(taskId);

      // Assert
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: taskId } });
      expect(result).toBeNull();
    });

    it('should pass correct parameters to findOne', async () => {
      // Arrange
      const taskId = 42;
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmTask);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockTask);

      // Act
      await repository.findById(taskId);

      // Assert
      expect(findOneSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 42 },
        }),
      );

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const taskId = 1;
      const errorMessage = 'Database error';
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.findById(taskId)).rejects.toThrow(errorMessage);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id: taskId } });
    });
  });

  describe('create', () => {
    it('should create task successfully', async () => {
      // Arrange
      const taskInput = {
        title: 'New Task',
        description: 'New Description',
        completed: false,
      };

      const newTask = new Task(
        3,
        new Date('2024-01-03T10:00:00.000Z'),
        new Date('2024-01-03T10:00:00.000Z'),
        'New Task',
        'New Description',
        false,
      );

      const newTypeOrmTask: TypeOrmTaskEntity = {
        id: 3,
        createdAt: new Date('2024-01-03T10:00:00.000Z'),
        updatedAt: new Date('2024-01-03T10:00:00.000Z'),
        deletedAt: undefined,
        title: 'New Task',
        description: 'New Description',
        completed: false,
      };

      const createSpy = jest
        .spyOn(typeOrmRepository, 'create')
        .mockReturnValue(newTypeOrmTask);
      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockResolvedValue(newTypeOrmTask);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(newTask);

      // Act
      const result = await repository.create(taskInput);

      // Assert
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(taskInput);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(newTypeOrmTask);
      expect(spyOnMapper).toHaveBeenCalledTimes(1);
      expect(spyOnMapper).toHaveBeenCalledWith(newTypeOrmTask);
      expect(result).toEqual(newTask);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should pass correct task data to create method', async () => {
      // Arrange
      const taskInput = {
        title: 'Specific Task',
        description: 'Specific Description',
        completed: true,
      };

      const createSpy = jest
        .spyOn(typeOrmRepository, 'create')
        .mockReturnValue(mockTypeOrmTask);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(mockTypeOrmTask);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockTask);

      // Act
      await repository.create(taskInput);

      // Assert
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Specific Task',
          description: 'Specific Description',
          completed: true,
        }),
      );

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should throw error when database save fails', async () => {
      // Arrange
      const taskInput = {
        title: 'New Task',
        description: 'New Description',
        completed: false,
      };

      const errorMessage = 'Database save failed';
      jest.spyOn(typeOrmRepository, 'create').mockReturnValue(mockTypeOrmTask);
      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.create(taskInput)).rejects.toThrow(errorMessage);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update task successfully', async () => {
      // Arrange
      const taskUpdate = {
        id: 1,
        title: 'Updated Task',
        completed: true,
      };

      const updatedTypeOrmTask: TypeOrmTaskEntity = {
        ...mockTypeOrmTask,
        title: 'Updated Task',
        completed: true,
      };

      const updatedTask = new Task(
        1,
        new Date('2024-01-01T10:00:00.000Z'),
        new Date('2024-01-01T10:00:00.000Z'),
        'Updated Task',
        'Test Description',
        true,
      );

      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockResolvedValue(updatedTypeOrmTask);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(updatedTask);

      // Act
      const result = await repository.update(taskUpdate);

      // Assert
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(taskUpdate);
      expect(spyOnMapper).toHaveBeenCalledTimes(1);
      expect(spyOnMapper).toHaveBeenCalledWith(updatedTypeOrmTask);
      expect(result).toEqual(updatedTask);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should pass partial task data to save method', async () => {
      // Arrange
      const partialUpdate = { id: 1, completed: true };
      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockResolvedValue(mockTypeOrmTask);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockTask);

      // Act
      await repository.update(partialUpdate);

      // Assert
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          completed: true,
        }),
      );

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should throw error when database update fails', async () => {
      // Arrange
      const taskUpdate = { id: 1, title: 'Updated Task' };
      const errorMessage = 'Database update failed';
      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.update(taskUpdate)).rejects.toThrow(errorMessage);
      expect(saveSpy).toHaveBeenCalledWith(taskUpdate);
    });
  });

  describe('delete', () => {
    it('should delete task successfully', async () => {
      // Arrange
      const taskId = 1;
      const deleteSpy = jest
        .spyOn(typeOrmRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      // Act
      await repository.delete(taskId);

      // Assert
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(taskId);
    });

    it('should pass correct id to delete method', async () => {
      // Arrange
      const taskId = 42;
      const deleteSpy = jest
        .spyOn(typeOrmRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      // Act
      await repository.delete(taskId);

      // Assert
      expect(deleteSpy).toHaveBeenCalledWith(42);
    });

    it('should throw error when database delete fails', async () => {
      // Arrange
      const taskId = 1;
      const errorMessage = 'Database delete failed';
      const deleteSpy = jest
        .spyOn(typeOrmRepository, 'delete')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.delete(taskId)).rejects.toThrow(errorMessage);
      expect(deleteSpy).toHaveBeenCalledWith(taskId);
    });

    it('should not return any value', async () => {
      // Arrange
      const taskId = 1;
      jest
        .spyOn(typeOrmRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      // Act
      const result = await repository.delete(taskId);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('TypeOrmTaskEntityMapper Integration', () => {
    it('should use TypeOrmTaskEntityMapper to convert entities', async () => {
      // Arrange
      jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmTask);
      const presentSpy = jest.spyOn(
        TypeOrmTaskEntityMapper,
        'fromTypeOrmToDomain',
      );

      // Act
      await repository.findById(1);

      // Assert
      expect(presentSpy).toHaveBeenCalledTimes(1);
      expect(presentSpy).toHaveBeenCalledWith(mockTypeOrmTask);

      // Cleanup
      presentSpy.mockRestore();
    });

    it('should return domain entity matching Task class', async () => {
      // Arrange
      jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmTask);

      const spyOnMapper = jest
        .spyOn(TypeOrmTaskEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockTask);

      // Act
      const result = await repository.findById(1);

      // Assert - Check domain entity compliance
      expect(result).toBeInstanceOf(Task);
      expect(typeof result!.id).toBe('number');
      expect(typeof result!.title).toBe('string');
      expect(typeof result!.description).toBe('string');
      expect(typeof result!.completed).toBe('boolean');
      expect(result!.createdAt).toBeInstanceOf(Date);
      expect(result!.updatedAt).toBeInstanceOf(Date);

      // Cleanup
      spyOnMapper.mockRestore();
    });
  });
});
