import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthenticateUserController } from './api/controller/AuthenticateUser/AuthenticateUser.controller';
import { AuthenticateUserUseCase } from './application/useCase/AuthenticateUser/AuthenticateUserUseCase';
import { IJwtGatewayToken } from './domain/interfaces/IJwtGateway';
import type { IUserRepository } from './domain/interfaces/IUserRepository';
import { IUserRepositoryToken } from './domain/interfaces/IUserRepository';
import { TypeOrmUserEntity } from './infrastructure/entity/TypeOrmUser.entity';
import { UserRepositoryImplementation } from './infrastructure/repository/UserRepositoryImplementation';
import { JwtGateway } from './infrastructure/security/JwtGateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmUserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'JWT_SECRET',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthenticateUserController],
  providers: [
    // Repositories Injection
    {
      provide: IUserRepositoryToken,
      useClass: UserRepositoryImplementation,
    },
    // Gateways Injection
    {
      provide: IJwtGatewayToken,
      useClass: JwtGateway,
    },
    // Use Cases
    AuthenticateUserUseCase,
  ],
  exports: [IUserRepositoryToken, IJwtGatewayToken],
})
export class AuthModule implements OnModuleInit {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  // Remover seed após feature de registro de usuário estar pronta
  async onModuleInit() {
    const email = 'user@example.com';
    const password = 'pass';
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.create({
        email,
        password: hashedPassword,
      });
    }
  }
}
