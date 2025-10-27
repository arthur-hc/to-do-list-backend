import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from 'http';
import { DataSource } from 'typeorm';
import { validate } from '../../../src/config/env.validation';
import { validationPipeConfig } from '../../../src/config/validationPipe.config';
import { AuthModule } from '../../../src/modules/auth/Auth.module';
import { JwtStrategy } from '../../../src/modules/auth/infrastructure/security/JwtStrategy';
import { TaskManagerModule } from '../../../src/modules/taskManager/TaskManager.module';
import { testEnvironmentConfig } from '../config/test-environment.config';
import { testMySqlDatabaseConfig } from './testDatabase.config';

export class TestAppFactory {
  static async create(): Promise<INestApplication<Server>> {
    Object.assign(process.env, testEnvironmentConfig);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate,
        }),
        TypeOrmModule.forRoot(testMySqlDatabaseConfig),
        TaskManagerModule,
        AuthModule,
      ],
      providers: [JwtStrategy],
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
