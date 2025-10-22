import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mySqlDBConfig } from './config/mySqlDB.config';
import { TaskManagerModule } from './modules/taskManager/TaskManager.module';

@Module({
  imports: [TypeOrmModule.forRoot(mySqlDBConfig), TaskManagerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
