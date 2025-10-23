import { Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { UpdateTaskStatusUseCase } from '../../application/useCase/UpdateTaskStatusUseCase/UpdateTaskStatusUseCase';
import { Task } from '../../domain/entity/Task.entity';
import { UpdateTaskStatusParamsDto } from '../dto/UpdateTaskStatusParams.dto';

@Controller()
export class UpdateTaskStatusController {
  constructor(
    private readonly updateTaskStatusUseCase: UpdateTaskStatusUseCase,
  ) {}

  @Patch('/tasks/:id/status')
  @HttpCode(HttpStatus.OK)
  async handle(@Param() params: UpdateTaskStatusParamsDto): Promise<Task> {
    const { id } = params;
    const updatedTask = await this.updateTaskStatusUseCase.execute(id);
    return updatedTask;
  }
}
