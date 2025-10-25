import { User } from '../entity/User.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}
