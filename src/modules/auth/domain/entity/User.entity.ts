export class User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  email: string;
  password: string;

  constructor(
    id: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  static create(
    email: string,
    password: string,
  ): Pick<User, 'email' | 'password'> {
    return {
      email,
      password,
    };
  }
}
