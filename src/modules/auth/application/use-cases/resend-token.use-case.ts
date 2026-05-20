import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { EMAIL_SERVICE_PORT, EmailServicePort } from '../ports/email.service.port';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { API_PREFIX } from '@/constants/api-prefix';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResendEmailUseCase {
  private readonly logger = new Logger(ResendEmailUseCase.name);

  constructor(
    @Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort,
    @Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort,
    @Inject(EMAIL_SERVICE_PORT) private readonly emailService: EmailServicePort,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isActive) throw new BadRequestException('Account is already verified');

    await this.authRepo.invalidatePreviousVerifyTokens(user.id);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.VERIFY_LINK_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createVerifyToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const backendBaseUrl = (this.configService.get<string>('app.publicUrl') ?? 'http://localhost:3000').replace(
      /\/$/,
      '',
    );
    const prefixPath = API_PREFIX.replace(/^\/+/, '');
    const verifyUrl = `${backendBaseUrl}/${prefixPath}/auth/verify-email?token=${rawToken}`;

    await this.emailService.sendVerificationEmail({
      to: email,
      verifyUrl,
      fullName: user.fullName ?? undefined,
    });

    this.logger.log(`Resend verification link sent to ${email}`);
  }
}
