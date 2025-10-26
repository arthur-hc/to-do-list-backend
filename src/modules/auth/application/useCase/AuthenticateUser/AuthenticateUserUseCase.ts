import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IUserRepositoryToken } from '../../../domain/interfaces/IUserRepository';
import type { IJwtGateway } from '../../../domain/interfaces/IJwtGateway';
import { IJwtGatewayToken } from '../../../domain/interfaces/IJwtGateway';
import { IAuthenticateUserInput } from './IAuthenticateUserInput';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(IJwtGatewayToken)
    private readonly jwtGateway: IJwtGateway,
  ) {}

  async execute(input: IAuthenticateUserInput): Promise<string> {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);

    const userExists = !!user;

    if (!userExists) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(`Invalid credentials`);
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtGateway.signAsync(payload);

    return token;
  }
}
