import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './api/controller/Auth.controller';
import { LoginUseCase } from './application/useCase/LoginUseCase/LoginUseCase';
import { UserSeedService } from './application/service/UserSeedService';
import { TypeOrmUser } from './infrastructure/entity/TypeOrmUser.entity';
import { UserRepositoryImplementation } from './infrastructure/repository/UserRepositoryImplementation';
import { IUserRepositoryToken } from './domain/interfaces/IUser.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmUser]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: UserRepositoryImplementation,
    },
    LoginUseCase,
    UserSeedService,
  ],
  exports: [IUserRepositoryToken, LoginUseCase],
})
export class AuthModule {}
