import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskUseCase } from '../../application/useCase/CreateTaskUseCase/CreateTaskUseCase';
import { CreateTaskDto } from '../dto/CreateTask.dto';
import { Task } from '../../domain/entity/Task.entity';

@ApiTags('tasks')
@Controller()
export class CreateTaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post('/tasks')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
  })
  async handle(@Body() createTaskBody: CreateTaskDto): Promise<Task> {
    const newTask = await this.createTaskUseCase.execute(createTaskBody);
    return newTask;
  }
}
