import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { GetTaskByIdUseCase } from '../../application/useCase/GetTaskByIdUseCase/GetTaskByIdUseCase';
import { GetTaskByIdDto } from '../dto/GetTaskById.dto';
import { Task } from '../../domain/entity/Task.entity';

@Controller()
export class GetTaskByIdController {
  constructor(private readonly getTaskByIdUseCase: GetTaskByIdUseCase) {}

  @Get('/tasks/:id')
  @HttpCode(HttpStatus.OK)
  async handle(@Param() params: GetTaskByIdDto): Promise<Task> {
    const { id } = params;
    const task = await this.getTaskByIdUseCase.execute(id);
    return task;
  }
}
