import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtServicePort, JwtPayload } from '../../application/ports/jwt.service.port';

@Injectable()
export class JwtServiceImpl implements JwtServicePort {
  constructor(private readonly jwtService: NestJwtService) {}

  signAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
