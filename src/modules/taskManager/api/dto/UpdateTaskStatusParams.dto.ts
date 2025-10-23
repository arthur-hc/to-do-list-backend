import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusParamsDto {
  @ApiProperty({
    description: 'ID único da tarefa',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'ID is required' })
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'ID must be a valid number' })
  @Min(1, { message: 'ID must be greater than 0' })
  id: number;
}
