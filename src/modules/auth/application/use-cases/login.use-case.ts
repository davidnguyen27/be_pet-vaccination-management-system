import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { LoginDto } from '../dtos/auth-req.dto';
import { JwtPayload } from '@/shared/decorators/current-user.decorator';
import { AuthTokensResponseDto } from '../dtos/auth-res.dto';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';
import { AUTH_CONSTANTS } from '@/constants';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: LoginDto, meta?: { userAgent?: string; ipAddress?: string }): Promise<AuthTokensResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);

    // Prevent user enumeration: same error for missing/inactive accounts
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid email or password');
    if (user.isDeleted) throw new NotFoundException('Your account has been deleted. Please contact support.');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleCode: user.roleCode,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: (this.configService.get<string>('jwt.accessExpiresIn') ?? '1h') as unknown as number,
    });

    // Pre-generate tokenId so it can be embedded as `jti` in the JWT for later DB lookup
    const tokenId = randomUUID();
    const rawRefreshToken = this.jwtService.sign(
      { ...payload, jti: tokenId },
      {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d') as unknown as number,
      },
    );

    const tokenHash = await bcrypt.hash(rawRefreshToken, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    // Derive expiry from the JWT itself so DB and token are always in sync
    const decodedAccess = this.jwtService.decode<{ exp: number }>(accessToken);
    const decoded = this.jwtService.decode<{ exp: number }>(rawRefreshToken);
    const accessExpiresAt = new Date(decodedAccess.exp * 1000);
    const expiresAt = new Date(decoded.exp * 1000);

    await this.authRepo.saveRefreshToken({
      tokenId,
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
    });

    await this.authRepo.updateLastLogin(user.id);

    return new AuthTokensResponseDto(accessToken, rawRefreshToken, accessExpiresAt, expiresAt);
  }
}
