import { User } from '../entity/User.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
}

export const IUserRepositoryToken = Symbol('IUserRepository');
