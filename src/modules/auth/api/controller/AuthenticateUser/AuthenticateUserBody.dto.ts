import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthenticateUserBodyDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'pass',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
