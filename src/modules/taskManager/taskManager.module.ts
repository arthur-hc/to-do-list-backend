import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTaskEntity } from './infrastructure/entity/TypeOrmTask.entity';
import { TaskRepositoryImplementation } from './infrastructure/repository/TaskRepositoryImplementation';
import { CreateTaskController } from './api/controller/CreateTask.controller';
import { GetAllTasksController } from './api/controller/GetAllTasks.controller';
import { GetTaskByIdController } from './api/controller/GetTaskById.controller';
import { UpdateTaskStatusController } from './api/controller/UpdateTaskStatus.controller';
import { CreateTaskUseCase } from './application/useCase/CreateTaskUseCase/CreateTaskUseCase';
import { GetAllTasksUseCase } from './application/useCase/GetAllTasksUseCase/GetAllTasksUseCase';
import { GetTaskByIdUseCase } from './application/useCase/GetTaskByIdUseCase/GetTaskByIdUseCase';
import { UpdateTaskStatusUseCase } from './application/useCase/UpdateTaskStatusUseCase/UpdateTaskStatusUseCase';
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
    GetAllTasksUseCase,
    GetTaskByIdUseCase,
    UpdateTaskStatusUseCase,
  ],
  controllers: [
    CreateTaskController,
    GetAllTasksController,
    GetTaskByIdController,
    UpdateTaskStatusController,
  ],
  exports: [ITaskRepositoryToken],
})
export class TaskManagerModule {}
