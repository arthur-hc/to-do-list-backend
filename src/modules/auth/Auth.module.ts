import { Module } from '@nestjs/common';
import { AuthenticateUserController } from './api/controller/AuthenticateUser/AuthenticateUser.controller';
import { AuthenticateUserUseCase } from './application/useCase/AuthenticateUser/AuthenticateUserUseCase';
import { IUserRepositoryToken } from './domain/interfaces/IUserRepository';
import { UserRepositoryImplementation } from './infrastructure/repository/UserRepositoryImplementation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserEntity } from './infrastructure/entity/TypeOrmUser.entity';
import { JwtModule } from '@nestjs/jwt';

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
export class AuthModule {}
