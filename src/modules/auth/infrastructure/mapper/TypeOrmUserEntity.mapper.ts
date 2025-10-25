import { User } from '../../domain/entity/User.entity';
import { TypeOrmUserEntity } from '../entity/TypeOrmUser.entity';

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
    const typeOrmUser = new TypeOrmUserEntity();
    typeOrmUser.id = user.id;
    typeOrmUser.email = user.email;
    typeOrmUser.password = user.password;
    typeOrmUser.createdAt = user.createdAt;
    typeOrmUser.updatedAt = user.updatedAt;

    return typeOrmUser;
  }
}
