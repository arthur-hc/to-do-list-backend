import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITaskRepositoryToken } from './domain/interfaces/ITask.repository';
import { TypeOrmTaskEntity } from './infrastructure/entity/TypeOrmTask.entity';
import { TaskRepositoryImplementation } from './infrastructure/repository/TaskRepositoryImplementation';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmTaskEntity])],
  providers: [
    TaskRepositoryImplementation,
    {
      provide: ITaskRepositoryToken,
      useClass: TaskRepositoryImplementation,
    },
  ],
  exports: [ITaskRepositoryToken],
})
export class TaskManagerModule {}
