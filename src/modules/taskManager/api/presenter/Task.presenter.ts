import { Task } from '../../domain/entity/Task.entity';
import { ITaskResponse } from './ITaskResponse';

export class TaskPresenter {
  static present(task: Task): ITaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
    };
  }

  static presentCollection(tasks: Task[]) {
    return tasks.map((task) => this.present(task));
  }
}
