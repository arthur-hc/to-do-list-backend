import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTaskEntity } from './infrastructure/entity/TypeOrmTask.entity';
import { TaskRepositoryImplementation } from './infrastructure/repository/TaskRepositoryImplementation';
import { CreateTaskController } from './api/controller/CreateTask.controller';
import { CreateTaskUseCase } from './application/useCase/CreateTaskUseCase/CreateTaskUseCase';
import { ITaskRepositoryToken } from './domain/interfaces/ITask.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmTaskEntity])],
  providers: [
    // Repositories Injection
    {
      provide: ITaskRepositoryToken,
      useClass: TaskRepositoryImplementation,
    },
    // Use Cases
    CreateTaskUseCase,
  ],
  controllers: [CreateTaskController],
  exports: [ITaskRepositoryToken],
})
export class TaskManagerModule {}
