import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmTaskEntity } from './infrastructure/entity/TypeOrmTask.entity';
import { TaskRepositoryImplementation } from './infrastructure/repository/TaskRepositoryImplementation';
import { CreateTaskController } from './api/controller/CreateTask/CreateTask.controller';
import { GetAllTasksController } from './api/controller/GetAllTasks/GetAllTasks.controller';
import { GetTaskByIdController } from './api/controller/GetTaskById/GetTaskById.controller';
import { UpdateTaskStatusController } from './api/controller/UpdateTaskStatus/UpdateTaskStatus.controller';
import { DeleteTaskController } from './api/controller/DeleteTask/DeleteTask.controller';
import { CreateTaskUseCase } from './application/useCase/CreateTask/CreateTaskUseCase';
import { GetAllTasksUseCase } from './application/useCase/GetAllTasks/GetAllTasksUseCase';
import { GetTaskByIdUseCase } from './application/useCase/GetTaskById/GetTaskByIdUseCase';
import { UpdateTaskStatusUseCase } from './application/useCase/UpdateTaskStatus/UpdateTaskStatusUseCase';
import { DeleteTaskUseCase } from './application/useCase/DeleteTask/DeleteTaskUseCase';
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
    DeleteTaskUseCase,
  ],
  controllers: [
    CreateTaskController,
    GetAllTasksController,
    GetTaskByIdController,
    UpdateTaskStatusController,
    DeleteTaskController,
  ],
  exports: [ITaskRepositoryToken],
})
export class TaskManagerModule {}
