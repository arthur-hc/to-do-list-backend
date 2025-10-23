import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsNotEmpty({ message: 'Completed is required' })
  @IsBoolean({ message: 'Completed must be a boolean value' })
  completed: boolean;
}
