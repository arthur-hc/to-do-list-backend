import { IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllTasksQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar tarefas por status de conclusão',
    example: true,
  })
  @IsOptional()
  @IsIn([true, false], {
    message: 'Completed must be true or false',
  })
  @Transform(({ value }: { value: string }) => {
    if (!value) {
      return undefined;
    }

    if (value === 'true') return true;
    if (value === 'false') return false;

    return value;
  })
  completed?: boolean;
}
