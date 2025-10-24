import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/useCase/LoginUseCase/LoginUseCase';
import { LoginDto } from '../dto/Login.dto';
import { LoginResponseDto } from '../dto/LoginResponse.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/auth/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login e obter token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async handle(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.loginUseCase.execute(loginDto);
  }
}
