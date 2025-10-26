import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testMySqlDatabaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '3308', 10),
  username: process.env.TEST_DB_USERNAME || 'test_user',
  password: process.env.TEST_DB_PASSWORD || 'test_pass',
  database: process.env.TEST_DB_NAME || 'todolist_test',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/**/migration/*.migration.ts'],
  synchronize: false,
  dropSchema: false,
  logging: false,
  migrationsRun: true,
  autoLoadEntities: true,
  retryAttempts: 3,
  retryDelay: 3000,
};
