import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetAllTasksUseCase } from '../../../application/useCase/GetAllTasks/GetAllTasksUseCase';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { TaskPresenter } from '../../presenter/Task.presenter';
import { GetAllTasksQueryDto } from './GetAllTasksQuery.dto';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/security/JwtAuth.guard';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
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
  async handle(@Query() query: GetAllTasksQueryDto): Promise<ITaskResponse[]> {
    {
      const tasks = await this.getAllTasksUseCase.execute(query);
      return TaskPresenter.presentCollection(tasks);
    }
  }
}
