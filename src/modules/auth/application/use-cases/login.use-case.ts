import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { AuthJwtPayload } from '../../domain/jwt-payload';
import { AuthTokensResponseDTO } from '../../presentation/http/dto/auth.dto';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { AUTH_CONSTANTS } from '@/constants/auth';

export interface LoginCommand {
  email: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort,
    @Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    command: LoginCommand,
    meta?: { userAgent?: string; ipAddress?: string },
  ): Promise<AuthTokensResponseDTO> {
    const user = await this.userRepo.findByEmail(command.email);

    // Prevent user enumeration: same error for missing/inactive accounts
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid email or password');
    if (user.isDeleted) throw new NotFoundException('Your account has been deleted. Please contact support.');

    const isMatch = await user.password.compare(command.password);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const tokenId = randomUUID();

    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      roleCode: user.roleCode,
      jti: tokenId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: (this.configService.get<string>('jwt.accessExpiresIn') ?? '1h') as unknown as number,
    });

    const rawRefreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d') as unknown as number,
    });

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

    return new AuthTokensResponseDTO(accessToken, rawRefreshToken, accessExpiresAt, expiresAt);
  }
}
