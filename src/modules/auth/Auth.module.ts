import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AuthenticateUserController } from './api/controller/AuthenticateUser/AuthenticateUser.controller';
import { AuthenticateUserUseCase } from './application/useCase/AuthenticateUser/AuthenticateUserUseCase';
import { IUserRepositoryToken } from './domain/interfaces/IUserRepository';
import type { IUserRepository } from './domain/interfaces/IUserRepository';
import { UserRepositoryImplementation } from './infrastructure/repository/UserRepositoryImplementation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserEntity } from './infrastructure/entity/TypeOrmUser.entity';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmUserEntity]),
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
    // Use Cases
    AuthenticateUserUseCase,
  ],
  exports: [IUserRepositoryToken],
})
export class AuthModule implements OnModuleInit {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

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
