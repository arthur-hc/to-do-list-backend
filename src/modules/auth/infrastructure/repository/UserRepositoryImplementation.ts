import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entity/User.entity';
import { TypeOrmUserEntity } from '../entity/TypeOrmUser.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmUserEntityMapper } from '../mapper/TypeOrmUserEntity.mapper';

@Injectable()
export class UserRepositoryImplementation implements IUserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntity)
    private readonly userRepository: Repository<TypeOrmUserEntity>,
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    return user ? TypeOrmUserEntityMapper.fromTypeOrmToDomain(user) : null;
  }

  async create(user: Pick<User, 'email' | 'password'>): Promise<User> {
    const newUser = this.userRepository.create(user);
    const createdUser = await this.userRepository.save(newUser);
    return TypeOrmUserEntityMapper.fromTypeOrmToDomain(createdUser);
  }
}
