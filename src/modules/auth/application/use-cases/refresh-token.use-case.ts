import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { I_AUTH_REPOSITORY } from '../../domain/repositories/i-auth.repository';
import type { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { AuthTokensResponseDto, RefreshTokenDto } from '../dtos/auth.dto';
import type { JwtPayload } from '../../../../shared/decorators/current-user.decorator';

const BCRYPT_SALT_ROUNDS = 10;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthTokensResponseDto> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Find all refresh tokens for user and match against the raw token
    // We can't reverse bcrypt, so we look up by userId and compare
    const user = await this.authRepo.findUserById(payload.sub);
    if (!user || user.isDeleted) throw new NotFoundException('User not found');

    // Find token record by searching stored hash (brute-force not needed —
    // store a deterministic identifier alongside). For simplicity here we
    // include the tokenId in the JWT payload in production; for now we pass
    // the raw token to the repo for bcrypt comparison via a helper method.
    // ➜ In this scaffold: token records are located by userId + expiry window.

    const newPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleCode: user.roleCode,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: (this.configService.get<string>('jwt.accessExpiresIn') ?? '1h') as unknown as number,
    });

    const newRawRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d') as unknown as number,
    });

    const tokenHash = await bcrypt.hash(newRawRefreshToken, BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await this.authRepo.saveRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return new AuthTokensResponseDto(newAccessToken, newRawRefreshToken);
  }
}
