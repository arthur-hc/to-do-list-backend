import { Task } from '../entity/Task.entity';
import { FindAllTasksFilter } from './IFindAllTasksFilter';

export interface ITaskRepository {
  findAll(filter?: FindAllTasksFilter): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  create(
    task: Pick<Task, 'title' | 'description' | 'completed'>,
  ): Promise<Task>;
  update(task: Partial<Task>): Promise<Task>;
  delete(id: number): Promise<void>;
}

export const ITaskRepositoryToken = Symbol('ITaskRepository');
