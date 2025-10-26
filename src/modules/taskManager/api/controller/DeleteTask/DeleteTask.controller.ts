import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DeleteTaskUseCase } from '../../../application/useCase/DeleteTask/DeleteTaskUseCase';
import { DeleteTaskParamsDto } from './DeleteTaskParams.dto';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/security/JwtAuth.guard';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller()
export class DeleteTaskController {
  constructor(private readonly deleteTaskUseCase: DeleteTaskUseCase) {}

  @Delete('/tasks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar uma tarefa' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: 'Tarefa deletada com sucesso',
  })
  async handle(@Param() params: DeleteTaskParamsDto): Promise<void> {
    const { id } = params;
    await this.deleteTaskUseCase.execute(id);
  }
}
