import { IAuthenticateUserResponse } from './IAuthenticateUserResponse';

export class AuthenticateUserPresenter {
  static authenticateResponse(token: string): IAuthenticateUserResponse {
    return {
      message: 'User authenticated successfully',
      token,
      tokenType: 'Bearer',
    };
  }
}
