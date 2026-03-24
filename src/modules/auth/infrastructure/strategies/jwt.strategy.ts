import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { JwtPayload } from '@/shared/decorators/current-user.decorator';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
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

  async validate(payload: JwtPayload): Promise<JwtPayload> {
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
    return payload;
  }
}
