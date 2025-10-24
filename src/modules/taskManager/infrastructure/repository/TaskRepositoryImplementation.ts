import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/entity/Task.entity';
import { ITaskRepository } from '../../domain/interfaces/ITask.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmTaskEntity } from '../entity/TypeOrmTask.entity';
import { Repository } from 'typeorm';
import { TypeOrmTaskEntityMapper } from '../mapper/TypeOrmTask.mapper';
import { IFindAllTasksFilter } from '../../domain/interfaces/IFindAllTasksFilter';

@Injectable()
export class TaskRepositoryImplementation implements ITaskRepository {
  constructor(
    @InjectRepository(TypeOrmTaskEntity)
    private readonly taskRepository: Repository<TypeOrmTaskEntity>,
  ) {}

  async findAll(filter?: IFindAllTasksFilter): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    if (filter?.completed !== undefined) {
      queryBuilder.where('task.completed = :completed', {
        completed: filter.completed,
      });
    }

    const tasks = await queryBuilder.getMany();
    return tasks.map((typeOrmTask) =>
      TypeOrmTaskEntityMapper.fromTypeOrmToDomain(typeOrmTask),
    );
  }
  async findById(id: number): Promise<Task | null> {
    const task = await this.taskRepository.findOne({ where: { id } });
    return task ? TypeOrmTaskEntityMapper.fromTypeOrmToDomain(task) : null;
  }
  async create(
    task: Pick<Task, 'title' | 'description' | 'completed'>,
  ): Promise<Task> {
    const newTask = this.taskRepository.create(task);
    const savedTask = await this.taskRepository.save(newTask);
    return TypeOrmTaskEntityMapper.fromTypeOrmToDomain(savedTask);
  }
  async update(task: Partial<Task>): Promise<Task> {
    const updatedTask = await this.taskRepository.save(task);
    return TypeOrmTaskEntityMapper.fromTypeOrmToDomain(updatedTask);
  }
  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
