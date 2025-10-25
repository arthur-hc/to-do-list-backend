import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetTaskByIdUseCase } from '../../../application/useCase/GetTaskByIdUseCase/GetTaskByIdUseCase';
import { GetTaskByIdParamsDto } from './GetTaskByIdParams.dto';
import { Task } from '../../../domain/entity/Task.entity';

@ApiTags('tasks')
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
  async handle(@Param() params: GetTaskByIdParamsDto): Promise<Task> {
    const { id } = params;
    const task = await this.getTaskByIdUseCase.execute(id);
    return task;
  }
}
