import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryImplementation } from './UserRepositoryImplementation';
import { TypeOrmUserEntity } from '../entity/TypeOrmUser.entity';
import { User } from '../../domain/entity/User.entity';
import { TypeOrmUserEntityMapper } from '../mapper/TypeOrmUserEntity.mapper';

describe('UserRepositoryImplementation', () => {
  let repository: UserRepositoryImplementation;
  let typeOrmRepository: jest.Mocked<Repository<TypeOrmUserEntity>>;

  // Mock TypeORM Entity
  const mockTypeOrmUser: TypeOrmUserEntity = {
    id: 1,
    createdAt: new Date('2024-01-01T10:00:00.000Z'),
    updatedAt: new Date('2024-01-01T10:00:00.000Z'),
    deletedAt: undefined,
    email: 'test@example.com',
    password: 'hashedPassword123',
  };

  // Mock Domain Entity
  const mockUser = new User(
    1,
    'test@example.com',
    'hashedPassword123',
    new Date('2024-01-01T10:00:00.000Z'),
    new Date('2024-01-01T10:00:00.000Z'),
  );

  beforeEach(async () => {
    // Create TypeORM Repository mock
    const mockTypeOrmRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImplementation,
        {
          provide: getRepositoryToken(TypeOrmUserEntity),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<UserRepositoryImplementation>(
      UserRepositoryImplementation,
    );
    typeOrmRepository = module.get<jest.Mocked<Repository<TypeOrmUserEntity>>>(
      getRepositoryToken(TypeOrmUserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      // Arrange
      const email = 'test@example.com';
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmUser);

      const spyOnMapper = jest
        .spyOn(TypeOrmUserEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockUser);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { email } });
      expect(spyOnMapper).toHaveBeenCalledTimes(1);
      expect(spyOnMapper).toHaveBeenCalledWith(mockTypeOrmUser);
      expect(result).toEqual(mockUser);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should return null when user not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail(email);

      // Assert
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { email } });
      expect(result).toBeNull();
    });

    it('should pass correct email parameter to findOne', async () => {
      // Arrange
      const email = 'specific@example.com';
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmUser);

      const spyOnMapper = jest
        .spyOn(TypeOrmUserEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockUser);

      // Act
      await repository.findByEmail(email);

      // Assert
      expect(findOneSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: 'specific@example.com' },
        }),
      );

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should handle different email formats correctly', async () => {
      // Arrange
      const emailCases = [
        'user@domain.com',
        'test.email+tag@example.org',
        'user.name@sub.domain.co.uk',
      ];

      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmUser);

      const spyOnMapper = jest
        .spyOn(TypeOrmUserEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockUser);

      // Act & Assert
      for (const email of emailCases) {
        await repository.findByEmail(email);
        expect(findOneSpy).toHaveBeenCalledWith({ where: { email } });
      }

      expect(findOneSpy).toHaveBeenCalledTimes(3);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const email = 'test@example.com';
      const errorMessage = 'Database connection failed';
      const findOneSpy = jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.findByEmail(email)).rejects.toThrow(errorMessage);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { email } });
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      // Arrange
      const userInput = {
        email: 'newuser@example.com',
        password: 'newHashedPassword',
      };

      const newUser = new User(
        3,
        'newuser@example.com',
        'newHashedPassword',
        new Date('2024-01-03T10:00:00.000Z'),
        new Date('2024-01-03T10:00:00.000Z'),
      );

      const newTypeOrmUser: TypeOrmUserEntity = {
        id: 3,
        createdAt: new Date('2024-01-03T10:00:00.000Z'),
        updatedAt: new Date('2024-01-03T10:00:00.000Z'),
        deletedAt: undefined,
        email: 'newuser@example.com',
        password: 'newHashedPassword',
      };

      const createSpy = jest
        .spyOn(typeOrmRepository, 'create')
        .mockReturnValue(newTypeOrmUser);
      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockResolvedValue(newTypeOrmUser);

      const spyOnMapper = jest
        .spyOn(TypeOrmUserEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(newUser);

      // Act
      const result = await repository.create(userInput);

      // Assert
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(userInput);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(newTypeOrmUser);
      expect(spyOnMapper).toHaveBeenCalledTimes(1);
      expect(spyOnMapper).toHaveBeenCalledWith(newTypeOrmUser);
      expect(result).toEqual(newUser);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should pass correct user data to create method', async () => {
      // Arrange
      const userInput = {
        email: 'specific@example.com',
        password: 'specificHashedPassword',
      };

      const createSpy = jest
        .spyOn(typeOrmRepository, 'create')
        .mockReturnValue(mockTypeOrmUser);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(mockTypeOrmUser);

      const spyOnMapper = jest
        .spyOn(TypeOrmUserEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockUser);

      // Act
      await repository.create(userInput);

      // Assert
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'specific@example.com',
          password: 'specificHashedPassword',
        }),
      );

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should handle user creation with different email formats', async () => {
      // Arrange
      const userInputs = [
        { email: 'user1@domain.com', password: 'password1' },
        { email: 'test.email+tag@example.org', password: 'password2' },
        { email: 'user.name@sub.domain.co.uk', password: 'password3' },
      ];

      const createSpy = jest
        .spyOn(typeOrmRepository, 'create')
        .mockReturnValue(mockTypeOrmUser);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(mockTypeOrmUser);

      const spyOnMapper = jest
        .spyOn(TypeOrmUserEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockUser);

      // Act & Assert
      for (const userInput of userInputs) {
        await repository.create(userInput);
        expect(createSpy).toHaveBeenCalledWith(userInput);
      }

      expect(createSpy).toHaveBeenCalledTimes(3);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should throw error when database create fails', async () => {
      // Arrange
      const userInput = {
        email: 'newuser@example.com',
        password: 'newHashedPassword',
      };

      const errorMessage = 'Database create failed';
      const createSpy = jest
        .spyOn(typeOrmRepository, 'create')
        .mockImplementation(() => {
          throw new Error(errorMessage);
        });

      // Act & Assert
      await expect(repository.create(userInput)).rejects.toThrow(errorMessage);
      expect(createSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw error when database save fails', async () => {
      // Arrange
      const userInput = {
        email: 'newuser@example.com',
        password: 'newHashedPassword',
      };

      const errorMessage = 'Database save failed';
      jest.spyOn(typeOrmRepository, 'create').mockReturnValue(mockTypeOrmUser);
      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.create(userInput)).rejects.toThrow(errorMessage);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle duplicate email constraint violation', async () => {
      // Arrange
      const userInput = {
        email: 'existing@example.com',
        password: 'password123',
      };

      const errorMessage = 'UNIQUE constraint failed: users.email';
      jest.spyOn(typeOrmRepository, 'create').mockReturnValue(mockTypeOrmUser);
      const saveSpy = jest
        .spyOn(typeOrmRepository, 'save')
        .mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(repository.create(userInput)).rejects.toThrow(errorMessage);
      expect(saveSpy).toHaveBeenCalledWith(mockTypeOrmUser);
    });
  });

  describe('TypeOrmUserEntityMapper Integration', () => {
    it('should use TypeOrmUserEntityMapper to convert entities', async () => {
      // Arrange
      jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmUser);
      const mapperSpy = jest.spyOn(
        TypeOrmUserEntityMapper,
        'fromTypeOrmToDomain',
      );

      // Act
      await repository.findByEmail('test@example.com');

      // Assert
      expect(mapperSpy).toHaveBeenCalledTimes(1);
      expect(mapperSpy).toHaveBeenCalledWith(mockTypeOrmUser);

      // Cleanup
      mapperSpy.mockRestore();
    });

    it('should return domain entity matching User class', async () => {
      // Arrange
      jest
        .spyOn(typeOrmRepository, 'findOne')
        .mockResolvedValue(mockTypeOrmUser);

      const spyOnMapper = jest
        .spyOn(TypeOrmUserEntityMapper, 'fromTypeOrmToDomain')
        .mockReturnValue(mockUser);

      // Act
      const result = await repository.findByEmail('test@example.com');

      // Assert - Check domain entity compliance
      expect(result).toBeInstanceOf(User);
      expect(typeof result!.id).toBe('number');
      expect(typeof result!.email).toBe('string');
      expect(typeof result!.password).toBe('string');
      expect(result!.createdAt).toBeInstanceOf(Date);
      expect(result!.updatedAt).toBeInstanceOf(Date);

      // Cleanup
      spyOnMapper.mockRestore();
    });

    it('should verify mapper is called during user creation', async () => {
      // Arrange
      const userInput = {
        email: 'newuser@example.com',
        password: 'newHashedPassword',
      };

      jest.spyOn(typeOrmRepository, 'create').mockReturnValue(mockTypeOrmUser);
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(mockTypeOrmUser);

      const mapperSpy = jest.spyOn(
        TypeOrmUserEntityMapper,
        'fromTypeOrmToDomain',
      );

      // Act
      await repository.create(userInput);

      // Assert
      expect(mapperSpy).toHaveBeenCalledTimes(1);
      expect(mapperSpy).toHaveBeenCalledWith(mockTypeOrmUser);

      // Cleanup
      mapperSpy.mockRestore();
    });
  });
});
