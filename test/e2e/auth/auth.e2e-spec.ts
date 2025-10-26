import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { TestAppFactory } from '../setup/TestApp.factory';
import { DatabaseCleanup } from '../utils/DatabaseCleanup';
import { TestHelpers } from '../utils/TestHelpers';
import { Server } from 'http';
import { IAuthenticateUserResponse } from 'src/modules/auth/api/presenter/AuthenticateUser/IAuthenticateUserResponse';

describe('POST /authenticate (e2e)', () => {
  let app: INestApplication<Server>;
  let typeOrmDataSource: DataSource;
  let httpServer: Server;

  beforeAll(async () => {
    app = await TestAppFactory.create();
    typeOrmDataSource = app.get<DataSource>(DataSource);
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await DatabaseCleanup.fullCleanup(typeOrmDataSource);
  });

  afterAll(async () => {
    await TestAppFactory.close(app);
  });

  describe('Success Cases', () => {
    it('should authenticate user successfully with valid credentials', async () => {
      const userData = {
        email: 'valid@example.com',
        password: 'validPassword123',
      };

      await TestHelpers.createTestUser(typeOrmDataSource, userData);

      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      const responseBody = response.body as IAuthenticateUserResponse;

      const jwtFormatRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

      expect(responseBody.message).toBe('User authenticated successfully');
      expect(responseBody.token).toEqual(expect.stringMatching(jwtFormatRegex));
      expect(responseBody.tokenType).toBe('Bearer');
      expect(responseBody.token.length).toBeGreaterThan(10);
      expect(TestHelpers.validateJWTResponse(responseBody)).toBe(true);
    });

    it('should return different tokens for different users', async () => {
      const user1 = TestHelpers.generateUniqueUserData('user1');
      const user2 = TestHelpers.generateUniqueUserData('user2');

      await TestHelpers.createTestUser(typeOrmDataSource, user1);
      await TestHelpers.createTestUser(typeOrmDataSource, user2);

      const response1 = await request(httpServer)
        .post('/authenticate')
        .send(user1)
        .expect(200);

      const response2 = await request(httpServer)
        .post('/authenticate')
        .send(user2)
        .expect(200);

      const response1Body = response1.body as IAuthenticateUserResponse;
      const response2Body = response2.body as IAuthenticateUserResponse;

      expect(response1Body.token).not.toBe(response2Body.token);
    });

    it('should authenticate user with different valid email formats', async () => {
      const testCases = [
        { email: 'user@domain.com', password: 'pass1' },
        { email: 'test.email@example.org', password: 'pass2' },
        { email: 'user+tag@subdomain.co.uk', password: 'pass3' },
      ];

      for (const userData of testCases) {
        await TestHelpers.createTestUser(typeOrmDataSource, userData);
      }

      for (const userData of testCases) {
        const response = await request(httpServer)
          .post('/authenticate')
          .send(userData)
          .expect(200);

        const responseBody = response.body as IAuthenticateUserResponse;
        expect(responseBody.token).toBeTruthy();
        expect(TestHelpers.validateJWTResponse(responseBody)).toBe(true);
      }
    });
  });

  describe('Validation Cases', () => {
    it('should return 400 when email is missing', async () => {
      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          password: 'somePassword',
        })
        .expect(400);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toContain('Email is required');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          email: 'test@example.com',
        })
        .expect(400);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toContain('Password is required');
    });

    it('should return 400 when email format is invalid', async () => {
      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          email: 'invalid-email-format',
          password: 'password123',
        })
        .expect(400);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toContain('Invalid email format');
    });

    it('should return 400 when both email and password are missing', async () => {
      const response = await request(httpServer)
        .post('/authenticate')
        .send({})
        .expect(400);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('Email is required'),
          expect.stringContaining('Password is required'),
        ]),
      );
    });

    it('should return 400 when sending extra fields', async () => {
      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          email: 'test@example.com',
          password: 'password123',
          extraField: 'should not be allowed',
        })
        .expect(400);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('property extraField should not exist'),
        ]),
      );
    });
  });

  describe('Authentication Cases', () => {
    it('should return 401 when user does not exist', async () => {
      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toBe('Invalid credentials');
    });

    it('should return 401 when password is incorrect', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'correctPassword',
      };
      await TestHelpers.createTestUser(typeOrmDataSource, userData);

      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          email: userData.email,
          password: 'wrongPassword',
        })
        .expect(401);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toBe('Invalid credentials');
    });

    it('should return 401 when email exists but password is empty', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'correctPassword',
      };
      await TestHelpers.createTestUser(typeOrmDataSource, userData);

      const response = await request(httpServer)
        .post('/authenticate')
        .send({
          email: userData.email,
          password: '',
        })
        .expect(400);

      const responseBody = response.body as IAuthenticateUserResponse;
      expect(responseBody.message).toContain('Password is required');
    });
  });
});
