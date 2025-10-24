import { Inject, Injectable } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/interfaces/ITask.repository';
import { ITaskRepositoryToken } from '../../../domain/interfaces/ITask.repository';
import { Task } from '../../../domain/entity/Task.entity';
import { CreateTaskInput } from './ICreateTaskInput';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(createTaskInput: CreateTaskInput): Promise<Task> {
    const { title, description } = createTaskInput;
    const newTask = Task.create(title, description);
    const createdTask = await this.taskRepository.create(newTask);
    return createdTask;
  }
}
