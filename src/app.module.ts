import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mySqlDBConfig } from './config/mySqlDB.config';
import { AuthModule } from './modules/auth/Auth.module';
import { TaskManagerModule } from './modules/taskManager/TaskManager.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(mySqlDBConfig),
    TaskManagerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
