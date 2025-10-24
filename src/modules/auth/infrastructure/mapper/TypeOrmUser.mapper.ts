import { User } from '../../domain/entity/User.entity';
import { TypeOrmUser } from '../entity/TypeOrmUser.entity';

export class TypeOrmUserMapper {
  static toDomain(typeOrmUser: TypeOrmUser): User {
    return new User(
      typeOrmUser.id,
      typeOrmUser.email,
      typeOrmUser.password,
      typeOrmUser.createdAt,
      typeOrmUser.updatedAt,
      typeOrmUser.deletedAt,
    );
  }

  static toTypeOrm(user: User): TypeOrmUser {
    const typeOrmUser = new TypeOrmUser();
    typeOrmUser.id = user.id;
    typeOrmUser.email = user.email;
    typeOrmUser.password = user.password;
    typeOrmUser.createdAt = user.createdAt;
    typeOrmUser.updatedAt = user.updatedAt;
    typeOrmUser.deletedAt = user.deletedAt;
    return typeOrmUser;
  }
}
