import { User } from '../entity/User.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(user: Pick<User, 'email' | 'password'>): Promise<User>;
  save(user: User): Promise<User>;
}

export const IUserRepositoryToken = Symbol('IUserRepository');
