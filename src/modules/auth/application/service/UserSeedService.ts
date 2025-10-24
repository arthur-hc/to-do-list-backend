import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { User } from '../../domain/entity/User.entity';
import type { IUserRepository } from '../../domain/interfaces/IUser.repository';
import { IUserRepositoryToken } from '../../domain/interfaces/IUser.repository';
import { hashPassword } from '../../utils/bcrypt.util';

@Injectable()
export class UserSeedService implements OnModuleInit {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.createDefaultUser();
  }

  private async createDefaultUser(): Promise<void> {
    const defaultEmail = 'user@test.com';
    const defaultPassword = 'pass';

    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(defaultEmail);
    if (existingUser) {
      console.log('Default user already exists');
      return;
    }

    // Criar hash da senha
    const hashedPassword = await hashPassword(defaultPassword);

    // Criar usuário
    const defaultUser = User.create(defaultEmail, hashedPassword);

    // Salvar no banco
    await this.userRepository.create(defaultUser);

    console.log(`Default user created: ${defaultEmail}`);
  }
}
