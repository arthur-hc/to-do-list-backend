import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticateUserController } from './AuthenticateUser.controller';
import { AuthenticateUserUseCase } from '../../../application/useCase/AuthenticateUser/AuthenticateUserUseCase';
import { AuthenticateUserBodyDto } from './AuthenticateUserBody.dto';
import { AuthenticateUserPresenter } from '../../presenter/AuthenticateUser/AuthenticateUser.presenter';
import { IAuthenticateUserResponse } from '../../presenter/AuthenticateUser/IAuthenticateUserResponse';

describe('AuthenticateUserController', () => {
  let controller: AuthenticateUserController;
  let authenticateUserUseCase: jest.Mocked<AuthenticateUserUseCase>;

  const mockToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const expectedResponse: IAuthenticateUserResponse = {
    message: 'User authenticated successfully',
    token: mockToken,
    tokenType: 'Bearer',
  };

  beforeEach(async () => {
    const mockAuthenticateUserUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateUserController],
      providers: [
        {
          provide: AuthenticateUserUseCase,
          useValue: mockAuthenticateUserUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthenticateUserController>(
      AuthenticateUserController,
    );
    authenticateUserUseCase = module.get(AuthenticateUserUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handle', () => {
    it('should authenticate user successfully', async () => {
      // Arrange
      const authenticateUserBody: AuthenticateUserBodyDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const spyOnUseCase =
        authenticateUserUseCase.execute.mockResolvedValue(mockToken);

      // Act
      const result = await controller.handle(authenticateUserBody);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledTimes(1);
      expect(spyOnUseCase).toHaveBeenCalledWith(authenticateUserBody);
      expect(result).toEqual(expectedResponse);
    });

    it('should return authentication response in the correct format', async () => {
      // Arrange
      const authenticateUserBody: AuthenticateUserBodyDto = {
        email: 'user@domain.com',
        password: 'securePassword',
      };

      const anotherToken = 'different.jwt.token';
      authenticateUserUseCase.execute.mockResolvedValue(anotherToken);

      // Act
      const result = await controller.handle(authenticateUserBody);

      // Assert
      expect(result).toHaveProperty(
        'message',
        'User authenticated successfully',
      );
      expect(result).toHaveProperty('token', anotherToken);
      expect(result).toHaveProperty('tokenType', 'Bearer');
    });

    it('should throw error when use case fails', async () => {
      // Arrange
      const authenticateUserBody: AuthenticateUserBodyDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      const errorMessage = 'Invalid credentials';
      const spyOnUseCase = authenticateUserUseCase.execute.mockRejectedValue(
        new Error(errorMessage),
      );

      // Act & Assert
      await expect(controller.handle(authenticateUserBody)).rejects.toThrow(
        errorMessage,
      );
      expect(spyOnUseCase).toHaveBeenCalledWith(authenticateUserBody);
    });

    it('should pass the correct credentials to use case', async () => {
      // Arrange
      const authenticateUserBody: AuthenticateUserBodyDto = {
        email: 'specific@test.com',
        password: 'specificPassword',
      };

      const spyOnUseCase =
        authenticateUserUseCase.execute.mockResolvedValue(mockToken);

      // Act
      await controller.handle(authenticateUserBody);

      // Assert
      expect(spyOnUseCase).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'specific@test.com',
          password: 'specificPassword',
        }),
      );
    });

    it('should handle different email formats', async () => {
      // Arrange
      const testCases = [
        { email: 'user@example.com', password: 'pass1' },
        { email: 'admin@company.org', password: 'pass2' },
        { email: 'test.user@domain.co.uk', password: 'pass3' },
      ];

      const spyOnUseCase =
        authenticateUserUseCase.execute.mockResolvedValue(mockToken);

      // Act & Assert
      for (const testCase of testCases) {
        const authenticateUserBody: AuthenticateUserBodyDto = testCase;

        await controller.handle(authenticateUserBody);

        expect(spyOnUseCase).toHaveBeenCalledWith(testCase);
      }

      expect(spyOnUseCase).toHaveBeenCalledTimes(3);
    });

    it('should return different tokens for different users', async () => {
      // Arrange
      const user1Body: AuthenticateUserBodyDto = {
        email: 'user1@example.com',
        password: 'password1',
      };

      const user2Body: AuthenticateUserBodyDto = {
        email: 'user2@example.com',
        password: 'password2',
      };

      const token1 = 'token.for.user1';
      const token2 = 'token.for.user2';

      // Act
      authenticateUserUseCase.execute.mockResolvedValueOnce(token1);
      const result1 = await controller.handle(user1Body);

      authenticateUserUseCase.execute.mockResolvedValueOnce(token2);
      const result2 = await controller.handle(user2Body);

      // Assert
      expect(result1.token).toBe(token1);
      expect(result2.token).toBe(token2);
      expect(result1.token).not.toBe(result2.token);
    });
  });

  describe('AuthenticateUser Presenter Integration', () => {
    it('should use AuthenticateUserPresenter to format response', async () => {
      // Arrange
      const authenticateUserBody: AuthenticateUserBodyDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authenticateUserUseCase.execute.mockResolvedValue(mockToken);

      // Spy on AuthenticateUserPresenter.authenticateResponse method
      const presentSpy = jest.spyOn(
        AuthenticateUserPresenter,
        'authenticateResponse',
      );

      // Act
      await controller.handle(authenticateUserBody);

      // Assert
      expect(presentSpy).toHaveBeenCalledTimes(1);
      expect(presentSpy).toHaveBeenCalledWith(mockToken);

      // Cleanup
      presentSpy.mockRestore();
    });

    it('should return response matching IAuthenticateUserResponse interface', async () => {
      // Arrange
      const authenticateUserBody: AuthenticateUserBodyDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authenticateUserUseCase.execute.mockResolvedValue(mockToken);

      // Act
      const result = await controller.handle(authenticateUserBody);

      // Assert - Check interface compliance
      expect(typeof result.message).toBe('string');
      expect(typeof result.token).toBe('string');
      expect(typeof result.tokenType).toBe('string');
      expect(result.tokenType).toBe('Bearer');
      expect(result.message).toBe('User authenticated successfully');
    });
  });
});
