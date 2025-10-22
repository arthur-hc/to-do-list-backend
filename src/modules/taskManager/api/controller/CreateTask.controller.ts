import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateTaskUseCase } from '../../application/useCase/CreateTaskUseCase/CreateTaskUseCase';
import { CreateTaskDto } from '../dto/CreateTask.dto';
import { Task } from '../../domain/entity/Task.entity';
@Controller()
export class CreateTaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post('/tasks')
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body() createTaskBody: CreateTaskDto): Promise<Task> {
    const newTask = await this.createTaskUseCase.execute(createTaskBody);
    return newTask;
  }
}
