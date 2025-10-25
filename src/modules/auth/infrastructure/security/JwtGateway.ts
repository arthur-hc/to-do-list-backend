import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtGateway,
  signAsyncPayload,
} from '../../domain/interfaces/IJwtGateway';

@Injectable()
export class JwtGateway implements IJwtGateway {
  constructor(private readonly jwtService: JwtService) {}

  async signAsync(payload: signAsyncPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
