import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/entity/Task.entity';
import type { ITaskRepository } from '../../../domain/interfaces/ITask.repository';
import { ITaskRepositoryToken } from '../../../domain/interfaces/ITask.repository';

@Injectable()
export class GetTaskByIdUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: number): Promise<Task> {
    const task = await this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}
