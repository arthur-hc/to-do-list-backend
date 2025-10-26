export interface signAsyncPayload {
  sub: number;
  email: string;
}

export interface IJwtGateway {
  signAsync(payload: signAsyncPayload): Promise<string>;
}

export const IJwtGatewayToken = Symbol('IJwtGateway');
