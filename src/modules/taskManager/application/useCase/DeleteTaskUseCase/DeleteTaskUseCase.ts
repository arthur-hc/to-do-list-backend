import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/interfaces/ITask.repository';
import { ITaskRepositoryToken } from '../../../domain/interfaces/ITask.repository';
import { IDeleteTaskInput } from './IDeleteTaskInput';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(input: IDeleteTaskInput): Promise<void> {
    const { id } = input;

    const task = await this.taskRepository.findById(id);

    const taskExists = !!task;
    if (!taskExists) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.taskRepository.delete(id);
  }
}
