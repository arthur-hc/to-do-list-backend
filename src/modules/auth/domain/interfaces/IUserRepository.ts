import { User } from '../entity/User.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(user: Pick<User, 'email' | 'password'>): Promise<User>;
}

export const IUserRepositoryToken = 'IUserRepositoryToken';
