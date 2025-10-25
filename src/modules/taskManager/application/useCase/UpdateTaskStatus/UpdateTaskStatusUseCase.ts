import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/entity/Task.entity';
import type { ITaskRepository } from '../../../domain/interfaces/ITask.repository';
import { ITaskRepositoryToken } from '../../../domain/interfaces/ITask.repository';

@Injectable()
export class UpdateTaskStatusUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    const taskExists = !!task;
    if (!taskExists) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    task.completed = !task.completed;

    const updatedTask = await this.taskRepository.update(task);
    return updatedTask;
  }
}
