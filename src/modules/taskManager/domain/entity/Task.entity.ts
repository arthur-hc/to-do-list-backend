export class Task {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  title: string;
  description: string;
  completed: boolean;

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    title: string,
    description: string,
    completed: boolean,
    deletedAt?: Date,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.deletedAt = deletedAt;
  }

  static create(
    title: string,
    description: string,
  ): Pick<Task, 'title' | 'description' | 'completed'> {
    return {
      title,
      description,
      completed: false,
    };
  }
}
