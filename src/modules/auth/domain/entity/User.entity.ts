export class User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(
    id: number,
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
    hashedPassword: string,
  ): Pick<User, 'email' | 'password'> {
    return {
      email,
      password: hashedPassword,
    };
  }
}
