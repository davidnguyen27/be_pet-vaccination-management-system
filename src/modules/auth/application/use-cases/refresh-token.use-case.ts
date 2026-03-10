import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'crypto';
import { I_AUTH_REPOSITORY } from '../../domain/i-auth.repository';
import type { IAuthRepository } from '../../domain/i-auth.repository';
import { RefreshTokenDto } from '../dtos/auth-req.dto';
import { AuthTokensResponseDto } from '../dtos/auth-res.dto';
import type { JwtPayload } from '@/shared/decorators/current-user.decorator';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
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

    // Extract the tokenId embedded as `jti` claim and validate against DB
    const { jti } = payload;
    if (!jti) throw new UnauthorizedException('Invalid refresh token');

    const storedToken = await this.authRepo.findRefreshToken(jti);
    if (!storedToken || storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive || user.isDeleted) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const newPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleCode: user.roleCode,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: (this.configService.get<string>('jwt.accessExpiresIn') ?? '1h') as unknown as number,
    });

    const newTokenId = randomUUID();
    const newRawRefreshToken = this.jwtService.sign(
      { ...newPayload, jti: newTokenId },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d') as unknown as number,
      },
    );

    const newTokenHash = createHash('sha256').update(newRawRefreshToken).digest('hex');
    const decoded = this.jwtService.decode<{ exp: number }>(newRawRefreshToken);
    const expiresAt = new Date(decoded.exp * 1000);

    // Token rotation: revoke old token, link to new one
    await this.authRepo.revokeRefreshToken(jti, newTokenId);
    await this.authRepo.saveRefreshToken({
      tokenId: newTokenId,
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt,
    });

    return new AuthTokensResponseDto(newAccessToken, newRawRefreshToken);
  }
}
