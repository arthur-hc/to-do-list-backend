import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const mySqlDBConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3307', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'todolist_db',

  // Configurações básicas
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
  timezone: 'Z',
  dateStrings: false,

  entities: ['dist/modules/**/infrastructure/entity/TypeOrm*.entity.js'],

  migrationsRun: process.env.NODE_ENV === 'production',
  migrations: ['dist/modules/**/infrastructure/migration/*.js'],
  migrationsTableName: 'migrations_history',
};
