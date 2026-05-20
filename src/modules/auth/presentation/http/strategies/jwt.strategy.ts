import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AuthJwtPayload } from '../../../domain/jwt-payload';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../../../application/ports/auth.repository.port';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort,
    @Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req?.cookies?.access_token as string | undefined) ?? null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessSecret') ?? '',
    });
  }

  async validate(payload: AuthJwtPayload): Promise<AuthJwtPayload> {
    if (!payload.jti) {
      throw new UnauthorizedException('Invalid access token');
    }

    const session = await this.authRepo.findRefreshToken(payload.jti);
    if (!session || session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Session has been revoked');
    }

    if (session.userId !== payload.sub) {
      throw new UnauthorizedException('Invalid access token');
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive || user.isDeleted) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return {
      ...payload,
      roleCode: user.roleCode,
    };
  }
}
