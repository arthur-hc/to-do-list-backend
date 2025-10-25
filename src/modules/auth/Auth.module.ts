import { Module } from '@nestjs/common';
import { AuthenticateUserController } from './api/controller/AuthenticateUser/AuthenticateUser.controller';

@Module({
  imports: [],
  controllers: [AuthenticateUserController],
  providers: [],
  exports: [],
})
export class AuthModule {}
