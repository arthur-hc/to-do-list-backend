import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../../src/modules/auth/Auth.module';
import { testMySqlDatabaseConfig } from './testDatabase.config';
import { DataSource } from 'typeorm';
import { validationPipeConfig } from '../../../src/config/validationPipe.config';
import { Server } from 'http';

export class TestAppFactory {
  static async create(): Promise<INestApplication<Server>> {
    process.env.NODE_ENV = 'test';
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '3308';
    process.env.DB_USER = 'test_user';
    process.env.DB_PASSWORD = 'test_pass';
    process.env.DB_NAME = 'todolist_test';
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-e2e-tests';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testMySqlDatabaseConfig), AuthModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

    await app.init();

    return app;
  }

  static async close(app: INestApplication): Promise<void> {
    if (app) {
      const dataSource = app.get<DataSource>(DataSource);
      if (dataSource && dataSource.isInitialized) {
        await dataSource.destroy();
      }
      await app.close();
    }
  }
}
