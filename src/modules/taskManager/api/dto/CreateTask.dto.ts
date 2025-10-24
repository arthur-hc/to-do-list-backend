import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Estudar NestJS',
    maxLength: 50,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(50, { message: 'Title must not exceed 50 characters' })
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example: 'Estudar os conceitos básicos de NestJS e implementar uma API',
    maxLength: 100,
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(100, { message: 'Description must not exceed 100 characters' })
  description: string;
}
