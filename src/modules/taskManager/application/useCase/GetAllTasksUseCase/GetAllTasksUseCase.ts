import { Inject, Injectable } from '@nestjs/common';
import type { ITaskRepository } from '../../../domain/interfaces/ITask.repository';
import { ITaskRepositoryToken } from '../../../domain/interfaces/ITask.repository';
import { Task } from '../../../domain/entity/Task.entity';
import { GetAllTasksInput } from './IGetAllTasksInput';

@Injectable()
export class GetAllTasksUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(input: GetAllTasksInput): Promise<Task[]> {
    const tasks = await this.taskRepository.findAll(input);
    return tasks;
  }
}
