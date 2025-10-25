import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllTasksUseCase } from '../../../application/useCase/GetAllTasksUseCase/GetAllTasksUseCase';
import { Task } from '../../../domain/entity/Task.entity';
import { GetAllTasksDto } from './GetAllTasks.dto';

@ApiTags('tasks')
@Controller()
export class GetAllTasksController {
  constructor(private readonly getAllTasksUseCase: GetAllTasksUseCase) {}

  @Get('/tasks')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar todas as tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso',
  })
  async handle(@Query() query: GetAllTasksDto): Promise<Task[]> {
    {
      const tasks = await this.getAllTasksUseCase.execute(query);
      return tasks;
    }
  }
}
