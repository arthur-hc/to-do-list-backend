import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { GetAllTasksUseCase } from '../../application/useCase/GetAllTasksUseCase/GetAllTasksUseCase';
import { Task } from '../../domain/entity/Task.entity';
import { GetAllTasksDto } from '../dto/GetAllTasks.dto';

@Controller()
export class GetAllTasksController {
  constructor(private readonly getAllTasksUseCase: GetAllTasksUseCase) {}

  @Get('/tasks')
  @HttpCode(HttpStatus.OK)
  async handle(@Query() query: GetAllTasksDto): Promise<Task[]> {
    {
      const tasks = await this.getAllTasksUseCase.execute(query);
      return tasks;
    }
  }
}
