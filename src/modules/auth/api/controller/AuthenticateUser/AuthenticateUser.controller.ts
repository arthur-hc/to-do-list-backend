import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAuthenticateUserResponse } from '../../presenter/AuthenticateUser/IAuthenticateUserResponse';
import { AuthenticateUserPresenter } from '../../presenter/AuthenticateUser/AuthenticateUser.presenter';
import { AuthenticateUserBodyDto } from './AuthenticateUserBody.dto';
import { AuthenticateUserUseCase } from '../../../application/useCase/AuthenticateUser/AuthenticateUserUseCase';

@ApiTags('User')
@Controller()
export class AuthenticateUserController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @Post('/authenticate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Autenticação foi bem-sucedida.',
  })
  async handle(
    @Body() body: AuthenticateUserBodyDto,
  ): Promise<IAuthenticateUserResponse> {
    const token = await this.authenticateUserUseCase.execute(body);
    return AuthenticateUserPresenter.authenticateResponse(token);
  }
}
