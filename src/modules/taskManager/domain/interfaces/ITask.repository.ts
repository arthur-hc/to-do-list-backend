import { Task } from '../entity/Task.entity';

export interface ITaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  create(
    task: Pick<Task, 'title' | 'description' | 'completed'>,
  ): Promise<Task>;
  update(task: Partial<Task>): Promise<Task>;
  delete(id: number): Promise<void>;
}

export const ITaskRepositoryToken = Symbol('ITaskRepository');
