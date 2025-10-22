import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mySqlDBConfig } from './config/mySqlDB.config';
import { TaskManagerModule } from './modules/taskManager/TaskManager.module';

@Module({
  imports: [TypeOrmModule.forRoot(mySqlDBConfig), TaskManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
