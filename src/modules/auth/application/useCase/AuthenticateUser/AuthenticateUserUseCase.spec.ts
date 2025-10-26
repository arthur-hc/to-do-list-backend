import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../../../domain/interfaces/IUserRepository';
import {
  IJwtGateway,
  IJwtGatewayToken,
} from '../../../domain/interfaces/IJwtGateway';
import { User } from '../../../domain/entity/User.entity';
import { IAuthenticateUserInput } from './IAuthenticateUserInput';

jest.mock('bcrypt');

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtGateway: jest.Mocked<IJwtGateway>;

  beforeEach(async () => {
    const mockUserRepository: jest.Mocked<IUserRepository> = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtGateway: jest.Mocked<IJwtGateway> = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticateUserUseCase,
        {
          provide: IUserRepositoryToken,
          useValue: mockUserRepository,
        },
        {
          provide: IJwtGatewayToken,
          useValue: mockJwtGateway,
        },
      ],
    }).compile();

    useCase = module.get<AuthenticateUserUseCase>(AuthenticateUserUseCase);
    userRepository =
      module.get<jest.Mocked<IUserRepository>>(IUserRepositoryToken);
    jwtGateway = module.get<jest.Mocked<IJwtGateway>>(IJwtGatewayToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should authenticate user successfully and return JWT token', async () => {
    // Arrange
    const input: IAuthenticateUserInput = {
      email: 'user@test.com',
      password: 'password123',
    };

    const mockUser = new User(
      1,
      'user@test.com',
      'hashedPassword',
      new Date(),
      new Date(),
    );

    const expectedToken = 'jwt-token-123';

    const findByEmailSpy = jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue(mockUser);

    const bcryptCompareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockResolvedValue(true as never);

    const jwtSignSpy = jest
      .spyOn(jwtGateway, 'signAsync')
      .mockResolvedValue(expectedToken);

    // Act
    const result = await useCase.execute(input);

    // Assert
    expect(findByEmailSpy).toHaveBeenCalledTimes(1);
    expect(findByEmailSpy).toHaveBeenCalledWith('user@test.com');

    expect(bcryptCompareSpy).toHaveBeenCalledTimes(1);
    expect(bcryptCompareSpy).toHaveBeenCalledWith(
      'password123',
      'hashedPassword',
    );

    expect(jwtSignSpy).toHaveBeenCalledTimes(1);
    expect(jwtSignSpy).toHaveBeenCalledWith({
      sub: 1,
      email: 'user@test.com',
    });

    expect(result).toBe(expectedToken);
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    // Arrange
    const input: IAuthenticateUserInput = {
      email: 'nonexistent@test.com',
      password: 'password123',
    };

    const findByEmailSpy = jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');

    expect(findByEmailSpy).toHaveBeenCalledTimes(2);
    expect(findByEmailSpy).toHaveBeenCalledWith('nonexistent@test.com');
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    // Arrange
    const input: IAuthenticateUserInput = {
      email: 'user@test.com',
      password: 'wrongPassword',
    };

    const mockUser = new User(
      1,
      'user@test.com',
      'hashedPassword',
      new Date(),
      new Date(),
    );

    const findByEmailSpy = jest
      .spyOn(userRepository, 'findByEmail')
      .mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    await expect(useCase.execute(input)).rejects.toThrow('Invalid credentials');

    expect(findByEmailSpy).toHaveBeenCalledTimes(2);
    expect(bcrypt.compare).toHaveBeenCalledTimes(2);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'wrongPassword',
      'hashedPassword',
    );
  });

  it('should throw error when repository fails', async () => {
    // Arrange
    const input: IAuthenticateUserInput = {
      email: 'user@test.com',
      password: 'password123',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Database error');
  });

  it('should throw error when bcrypt comparison fails', async () => {
    // Arrange
    const input: IAuthenticateUserInput = {
      email: 'user@test.com',
      password: 'password123',
    };

    const mockUser = new User(
      1,
      'user@test.com',
      'hashedPassword',
      new Date(),
      new Date(),
    );

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockRejectedValue(
      new Error('Bcrypt error'),
    );

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('Bcrypt error');
  });

  it('should throw error when JWT gateway fails', async () => {
    // Arrange
    const input: IAuthenticateUserInput = {
      email: 'user@test.com',
      password: 'password123',
    };

    const mockUser = new User(
      1,
      'user@test.com',
      'hashedPassword',
      new Date(),
      new Date(),
    );

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest
      .spyOn(jwtGateway, 'signAsync')
      .mockRejectedValue(new Error('JWT error'));

    // Act & Assert
    await expect(useCase.execute(input)).rejects.toThrow('JWT error');
  });
});
