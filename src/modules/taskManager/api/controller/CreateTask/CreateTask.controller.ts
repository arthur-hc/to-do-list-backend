import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskUseCase } from '../../../application/useCase/CreateTask/CreateTaskUseCase';
import { ITaskResponse } from '../../presenter/ITaskResponse';
import { TaskPresenter } from '../../presenter/Task.presenter';
import { CreateTaskBodyDto } from './CreateTaskBody.dto';

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
  async handle(
    @Body() createTaskBody: CreateTaskBodyDto,
  ): Promise<ITaskResponse> {
    const newTask = await this.createTaskUseCase.execute(createTaskBody);
    return TaskPresenter.present(newTask);
  }
}
