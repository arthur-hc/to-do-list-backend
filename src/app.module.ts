import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './config/env.validation';
import { mySqlDBConfig } from './config/mySqlDB.config';
import { AuthModule } from './modules/auth/Auth.module';
import { TaskManagerModule } from './modules/taskManager/TaskManager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRoot(mySqlDBConfig),
    TaskManagerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
