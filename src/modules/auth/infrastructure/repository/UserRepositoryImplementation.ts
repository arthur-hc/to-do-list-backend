import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entity/User.entity';
import { IUserRepository } from '../../domain/interfaces/IUser.repository';
import { TypeOrmUserEntity } from '../entity/TypeOrmUserEntity.entity';
import { TypeOrmUserEntityMapper } from '../mapper/TypeOrmUserEntity.mapper';

@Injectable()
export class UserRepositoryImplementation implements IUserRepository {
  constructor(
    @InjectRepository(TypeOrmUserEntity)
    private readonly userRepository: Repository<TypeOrmUserEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const typeOrmUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!typeOrmUser) {
      return null;
    }

    return TypeOrmUserEntityMapper.fromTypeOrmToDomain(typeOrmUser);
  }

  async findById(id: number): Promise<User | null> {
    const typeOrmUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!typeOrmUser) {
      return null;
    }

    return TypeOrmUserEntityMapper.fromTypeOrmToDomain(typeOrmUser);
  }

  async create(user: Pick<User, 'email' | 'password'>): Promise<User> {
    const newUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);
    return TypeOrmUserEntityMapper.fromTypeOrmToDomain(savedUser);
  }

  async save(user: User): Promise<User> {
    const typeOrmUser = TypeOrmUserEntityMapper.fromDomainToTypeOrm(user);
    const savedUser = await this.userRepository.save(typeOrmUser);
    return TypeOrmUserEntityMapper.fromTypeOrmToDomain(savedUser);
  }
}
