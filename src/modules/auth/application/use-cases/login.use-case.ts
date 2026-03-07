import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { AuthTokensResponseDto, LoginDto } from '../dtos/auth.dto';
import { JwtPayload } from '@/shared/decorators/current-user.decorator';

const BCRYPT_SALT_ROUNDS = 10;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: LoginDto, meta?: { userAgent?: string; ipAddress?: string }): Promise<AuthTokensResponseDto> {
    const user = await this.authRepo.findUserByEmail(dto.email);
    if (!user) throw new NotFoundException('Invalid credentials');
    if (!user.isActive) {
      throw new UnauthorizedException('Account not activated. Please verify your email.');
    }
    if (user.isDeleted) throw new NotFoundException('Account not found');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleCode: user.roleCode,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: (this.configService.get<string>('jwt.accessExpiresIn') ?? '1h') as unknown as number,
    });

    const rawRefreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d') as unknown as number,
    });

    const tokenHash = await bcrypt.hash(rawRefreshToken, BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    await this.authRepo.saveRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
    });

    await this.authRepo.updateLastLogin(user.id);

    return new AuthTokensResponseDto(accessToken, rawRefreshToken);
  }
}
