import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { AuthTokensResponseDTO } from '../../presentation/http/dto/auth.dto';
import { AuthJwtPayload } from '../../domain/jwt-payload';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { AUTH_CONSTANTS } from '@/constants/auth';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort,
    @Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(refreshToken: string): Promise<AuthTokensResponseDTO> {
    let payload: AuthJwtPayload;
    try {
      payload = this.jwtService.verify<AuthJwtPayload>(refreshToken, {
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

    // Verify the token hash to prevent token substitution attacks
    const isHashValid = await bcrypt.compare(refreshToken, storedToken.tokenHash);
    if (!isHashValid) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive || user.isDeleted) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const newTokenId = randomUUID();

    const newPayload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      roleCode: user.roleCode,
      jti: newTokenId,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: (this.configService.get<string>('jwt.accessExpiresIn') ?? '1h') as unknown as number,
    });

    const newRawRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d') as unknown as number,
    });

    const newTokenHash = await bcrypt.hash(newRawRefreshToken, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const decodedAccess = this.jwtService.decode<{ exp: number }>(newAccessToken);
    const decoded = this.jwtService.decode<{ exp: number }>(newRawRefreshToken);
    const accessExpiresAt = new Date(decodedAccess.exp * 1000);
    const expiresAt = new Date(decoded.exp * 1000);

    // Token rotation: revoke old token, link to new one
    await this.authRepo.revokeRefreshToken(jti, user.id, newTokenId);
    await this.authRepo.saveRefreshToken({
      tokenId: newTokenId,
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt,
    });

    return new AuthTokensResponseDTO(newAccessToken, newRawRefreshToken, accessExpiresAt, expiresAt);
  }
}
