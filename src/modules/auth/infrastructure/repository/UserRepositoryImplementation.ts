import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entity/User.entity';
import { IUserRepository } from '../../domain/interfaces/IUser.repository';
import { TypeOrmUser } from '../entity/TypeOrmUser.entity';
import { TypeOrmUserMapper } from '../mapper/TypeOrmUser.mapper';

@Injectable()
export class UserRepositoryImplementation implements IUserRepository {
  constructor(
    @InjectRepository(TypeOrmUser)
    private readonly userRepository: Repository<TypeOrmUser>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const typeOrmUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!typeOrmUser) {
      return null;
    }

    return TypeOrmUserMapper.toDomain(typeOrmUser);
  }

  async save(user: User): Promise<User> {
    const typeOrmUser = TypeOrmUserMapper.toTypeOrm(user);
    const savedUser = await this.userRepository.save(typeOrmUser);
    return TypeOrmUserMapper.toDomain(savedUser);
  }

  async findById(id: number): Promise<User | null> {
    const typeOrmUser = await this.userRepository.findOne({
      where: { id },
    });

    if (!typeOrmUser) {
      return null;
    }

    return TypeOrmUserMapper.toDomain(typeOrmUser);
  }
}
