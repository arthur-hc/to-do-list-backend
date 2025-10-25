import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetTaskByIdUseCase } from '../../../application/useCase/GetTaskById/GetTaskByIdUseCase';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { TaskPresenter } from '../../presenter/Task.presenter';
import { GetTaskByIdParamsDto } from './GetTaskByIdParams.dto';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/security/JwtAuth.guard';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
@Controller()
export class GetTaskByIdController {
  constructor(private readonly getTaskByIdUseCase: GetTaskByIdUseCase) {}

  @Get('/tasks/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar tarefa por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Tarefa encontrada com sucesso',
  })
  async handle(@Param() params: GetTaskByIdParamsDto): Promise<ITaskResponse> {
    const { id } = params;
    const task = await this.getTaskByIdUseCase.execute(id);
    return TaskPresenter.present(task);
  }
}
