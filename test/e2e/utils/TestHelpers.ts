import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Server } from 'http';
import { TypeOrmUserEntity } from '../../../src/modules/auth/infrastructure/entity/TypeOrmUser.entity';
import { TypeOrmTaskEntity } from '../../../src/modules/taskManager/infrastructure/entity/TypeOrmTask.entity';
import { IAuthenticateUserResponse } from 'src/modules/auth/api/presenter/AuthenticateUser/IAuthenticateUserResponse';
import { ITaskResponse } from 'src/modules/taskManager/api/presenter/ITaskResponse';

export class TestHelpers {
  static async createTestUser(
    typeOrmDataSource: DataSource,
    userData: { email: string; password: string } = {
      email: 'test@example.com',
      password: 'password123',
    },
  ): Promise<{ id: number; email: string; password: string }> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userRepository = typeOrmDataSource.getRepository(TypeOrmUserEntity);
    const result = await userRepository.save({
      email: userData.email,
      password: hashedPassword,
    });
    return {
      id: result.id,
      email: result.email,
      password: result.password,
    };
  }

  static async getAuthToken(
    app: INestApplication<Server>,
    credentials: { email: string; password: string } = {
      email: 'test@example.com',
      password: 'password123',
    },
  ): Promise<string> {
    const httpServer = app.getHttpServer();
    const response = await request(httpServer)
      .post('/authenticate')
      .send(credentials)
      .expect(200);
    const authResponse = response.body as IAuthenticateUserResponse;
    return authResponse.token;
  }

  static async createUserAndGetToken(
    app: INestApplication<Server>,
    typeOrmDataSource: DataSource,
    userData: { email: string; password: string } = {
      email: 'test@example.com',
      password: 'password123',
    },
  ): Promise<{ user: any; token: string }> {
    const user = await this.createTestUser(typeOrmDataSource, userData);
    const token = await this.getAuthToken(app, userData);
    return { user, token };
  }

  static isValidJwt(token: string): boolean {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    return jwtRegex.test(token);
  }

  static validateJWTResponse(authResponse: IAuthenticateUserResponse): boolean {
    const isValidMessage =
      authResponse?.message === 'User authenticated successfully';

    const isValidToken =
      typeof authResponse?.token === 'string' &&
      this.isValidJwt(authResponse?.token);

    const isValidTokenType = authResponse?.tokenType === 'Bearer';

    return isValidMessage && isValidToken && isValidTokenType;
  }

  static generateUniqueUserData(suffix: string = Date.now().toString()): {
    email: string;
    password: string;
  } {
    return {
      email: `test-${suffix}@example.com`,
      password: `password-${suffix}`,
    };
  }

  static async getUserFromDatabase(
    typeOrmDataSource: DataSource,
    email: string,
  ): Promise<TypeOrmUserEntity | null> {
    const userRepository = typeOrmDataSource.getRepository(TypeOrmUserEntity);
    const user = await userRepository.findOne({ where: { email } });
    return user;
  }

  static async userExistsInDatabase(
    typeOrmDataSource: DataSource,
    email: string,
  ): Promise<boolean> {
    const user = await this.getUserFromDatabase(typeOrmDataSource, email);
    const userExists = !!user;
    return userExists;
  }

  static async createTestTask(
    typeOrmDataSource: DataSource,
    taskData: { title: string; description: string; completed?: boolean } = {
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
    },
  ): Promise<TypeOrmTaskEntity> {
    const taskRepository = typeOrmDataSource.getRepository(TypeOrmTaskEntity);
    const task = await taskRepository.save({
      title: taskData.title,
      description: taskData.description,
      completed: taskData.completed ?? false,
    });
    return task;
  }

  static async getTaskFromDatabase(
    typeOrmDataSource: DataSource,
    taskId: number,
  ): Promise<TypeOrmTaskEntity | null> {
    const taskRepository = typeOrmDataSource.getRepository(TypeOrmTaskEntity);
    const task = await taskRepository.findOne({ where: { id: taskId } });
    return task;
  }

  static async taskExistsInDatabase(
    typeOrmDataSource: DataSource,
    taskId: number,
  ): Promise<boolean> {
    const task = await this.getTaskFromDatabase(typeOrmDataSource, taskId);
    return !!task;
  }

  static generateUniqueTaskData(suffix: string = Date.now().toString()): {
    title: string;
    description: string;
  } {
    return {
      title: `Test Task ${suffix}`,
      description: `Test Description ${suffix}`,
    };
  }

  static validateTaskResponse(taskResponse: ITaskResponse): boolean {
    const hasValidId = typeof taskResponse.id === 'number';
    const hasValidTitle = typeof taskResponse.title === 'string';
    const hasValidDescription = typeof taskResponse.description === 'string';
    const hasValidCompleted = typeof taskResponse.completed === 'boolean';

    const hasValidCreatedAt =
      typeof taskResponse.createdAt === 'string' &&
      !isNaN(new Date(taskResponse.createdAt).getTime());

    return (
      hasValidId &&
      hasValidTitle &&
      hasValidDescription &&
      hasValidCompleted &&
      hasValidCreatedAt
    );
  }

  static validateTasksCollectionResponse(
    tasksResponse: ITaskResponse[],
  ): boolean {
    if (!Array.isArray(tasksResponse)) return false;
    return tasksResponse.every((task) => this.validateTaskResponse(task));
  }
}
