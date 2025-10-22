import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/entity/Task.entity';
import { ITaskRepository } from '../../domain/interfaces/ITask.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmTaskEntity } from '../entity/TypeOrmTask.entity';
import { Repository } from 'typeorm';
import { TypeOrmTasEntityMapper } from '../mapper/TypeOrmTask.mapper';

@Injectable()
export class TaskRepositoryImplementation implements ITaskRepository {
  constructor(
    @InjectRepository(TypeOrmTaskEntity)
    private readonly taskRepository: Repository<TypeOrmTaskEntity>,
  ) {}

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks.map((typeOrmTask) =>
      TypeOrmTasEntityMapper.fromTypeOrmToDomain(typeOrmTask),
    );
  }
  async findById(id: number): Promise<Task | null> {
    const task = await this.taskRepository.findOne({ where: { id } });
    return task ? TypeOrmTasEntityMapper.fromTypeOrmToDomain(task) : null;
  }
  async create(task: Task): Promise<Task> {
    const newTask = this.taskRepository.create(task);
    const savedTask = await this.taskRepository.save(newTask);
    return TypeOrmTasEntityMapper.fromTypeOrmToDomain(savedTask);
  }
  async update(task: Task): Promise<Task> {
    const updatedTask = await this.taskRepository.save(task);
    return TypeOrmTasEntityMapper.fromTypeOrmToDomain(updatedTask);
  }
  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
