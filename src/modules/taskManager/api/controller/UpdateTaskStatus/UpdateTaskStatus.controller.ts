import { Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTaskStatusUseCase } from '../../../application/useCase/UpdateTaskStatus/UpdateTaskStatusUseCase';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { TaskPresenter } from '../../presenter/Task.presenter';
import { UpdateTaskStatusParamsDto } from './UpdateTaskStatusParams.dto';

@ApiTags('tasks')
@Controller()
export class UpdateTaskStatusController {
  constructor(
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
  ) {}

  @Patch('/tasks/:id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Alternar status de conclusão da tarefa' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Status da tarefa atualizado com sucesso',
  })
  async handle(
    @Param() params: UpdateTaskStatusParamsDto,
  ): Promise<ITaskResponse> {
    const { id } = params;
    const updatedTask = await this.updateTaskStatusUseCase.execute(id);
    return TaskPresenter.present(updatedTask);
  }
}
