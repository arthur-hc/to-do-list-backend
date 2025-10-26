import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllTasksUseCase } from '../../../application/useCase/GetAllTasks/GetAllTasksUseCase';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { TaskPresenter } from '../../presenter/Task.presenter';
import { GetAllTasksQueryDto } from './GetAllTasksQuery.dto';
import { JwtAuthGuard } from '../../../../auth/infrastructure/security/JwtAuth.guard';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
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
