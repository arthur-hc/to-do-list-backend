import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { DeleteTaskUseCase } from '../../application/useCase/DeleteTaskUseCase/DeleteTaskUseCase';
import { DeleteTaskParamsDto } from '../dto/DeleteTaskParams.dto';

@Controller()
export class DeleteTaskController {
  constructor(private readonly deleteTaskUseCase: DeleteTaskUseCase) {}

  @Delete('/tasks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param() params: DeleteTaskParamsDto): Promise<void> {
    const { id } = params;
    await this.deleteTaskUseCase.execute({ id });
  }
}
