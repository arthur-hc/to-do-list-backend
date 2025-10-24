import { User } from '../../domain/entity/User.entity';
import { TypeOrmUserEntity } from '../entity/TypeOrmUserEntity.entity';

export class TypeOrmUserEntityMapper {
  public static fromTypeOrmToDomain(typeOrmUser: TypeOrmUserEntity): User {
    return new User(
      typeOrmUser.id,
      typeOrmUser.email,
      typeOrmUser.password,
      typeOrmUser.createdAt,
      typeOrmUser.updatedAt,
      typeOrmUser.deletedAt,
    );
  }

  public static fromDomainToTypeOrm(user: User): TypeOrmUserEntity {
    return Object.assign(new TypeOrmUserEntity(), {
      id: user.id,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    });
  }
}
