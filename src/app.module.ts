import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mySqlDBConfig } from './config/mySqlDB.config';

@Module({
  imports: [TypeOrmModule.forRoot(mySqlDBConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
