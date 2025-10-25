import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from 'src/modules/auth/domain/interfaces/IUserRepository';
import { IUserRepositoryToken } from 'src/modules/auth/domain/interfaces/IUserRepository';
import { IAuthenticateUserInput } from './IAuthenticateUserInput';

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: IAuthenticateUserInput): Promise<string> {
    const { email, password } = input;

    const user = (await this.userRepository.findByEmail(email)) || {
      id: '1',
      email: 'user@test.com',
      password: 'pass',
    };

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

    const token = this.jwtService.sign(payload);

    return token;
  }
}
