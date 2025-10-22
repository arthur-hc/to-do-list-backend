import { Task } from '../../domain/entity/Task.entity';
import { TypeOrmTaskEntity } from '../entity/TypeOrmTask.entity';

export class TypeOrmTaskEntityMapper {
  public static fromTypeOrmToDomain(typeOrmTask: TypeOrmTaskEntity): Task {
    return new Task(
      typeOrmTask.id,
      typeOrmTask.createdAt,
      typeOrmTask.updatedAt,
      typeOrmTask.title,
      typeOrmTask.description,
      typeOrmTask.completed,
      typeOrmTask.deletedAt,
    );
  }

  public static fromDomainToTypeOrm(domainTask: Task): TypeOrmTaskEntity {
    return Object.assign(new TypeOrmTaskEntity(), {
      id: domainTask.id,
      title: domainTask.title,
      description: domainTask.description,
      completed: domainTask.completed,
      createdAt: domainTask.createdAt,
      updatedAt: domainTask.updatedAt,
      deletedAt: domainTask.deletedAt,
    });
  }
}
