import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must have at least 10 characters' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description: string;
}
