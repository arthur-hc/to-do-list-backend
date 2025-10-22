import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetTaskByIdDto {
  @IsNotEmpty({ message: 'ID is required' })
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'ID must be a valid number' })
  @Min(1, { message: 'ID must be greater than 0' })
  id: number;
}
