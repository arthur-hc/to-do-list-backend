import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IAuthenticateUserResponse } from '../../presenter/AuthenticateUser/IAuthenticateUserResponse';
import { AuthenticateUserPresenter } from '../../presenter/AuthenticateUser/AuthenticateUser.presenter';
import { AuthenticateUserBodyDto } from './AuthenticateUserBody.dto';

@ApiTags('User')
@Controller()
export class AuthenticateUserController {
  @Post('/authenticate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar um usuário' })
  @ApiResponse({
    status: 201,
    description: 'Autenticação foi bem-sucedida.',
  })
  async handle(
    @Body() body: AuthenticateUserBodyDto,
  ): Promise<IAuthenticateUserResponse> {
    const token = 'Will return a jwt token here';
    return AuthenticateUserPresenter.authenticateResponse(token);
  }
}
