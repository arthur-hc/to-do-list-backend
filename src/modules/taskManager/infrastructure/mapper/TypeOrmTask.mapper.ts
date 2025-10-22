import { Task } from '../../domain/entity/Task.entity';
import { TypeOrmTaskEntity } from '../entity/TypeOrmTask.entity';

export class TypeOrmTasEntityMapper {
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
    const typeOrmTask = new TypeOrmTaskEntity();
    typeOrmTask.id = domainTask.id;
    typeOrmTask.createdAt = domainTask.createdAt;
    typeOrmTask.updatedAt = domainTask.updatedAt;
    typeOrmTask.title = domainTask.title;
    typeOrmTask.description = domainTask.description;
    typeOrmTask.completed = domainTask.completed;
    typeOrmTask.deletedAt = domainTask.deletedAt;
    return typeOrmTask;
  }
}
