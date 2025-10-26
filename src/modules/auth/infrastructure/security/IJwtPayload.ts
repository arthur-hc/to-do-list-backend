export interface IJwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}
