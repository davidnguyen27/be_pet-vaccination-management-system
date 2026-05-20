import { Inject, Injectable, Logger } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { EMAIL_SERVICE_PORT, EmailServicePort } from '../ports/email.service.port';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { ConfigService } from '@nestjs/config';

export interface ForgotPasswordCommand {
  email: string;
}

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    @Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort,
    @Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort,
    @Inject(EMAIL_SERVICE_PORT) private readonly emailService: EmailServicePort,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<{ message: string }> {
    const user = await this.userRepo.findByEmail(command.email);
    if (!user || !user.isActive || user.isDeleted) {
      return {
        message: 'If this email exists, a reset password link has been sent.',
      };
    }

    await this.authRepo.invalidatePreviousVerifyTokens(user.id);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.VERIFY_LINK_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createVerifyToken({
      userId: user.id,
      tokenHash,
      expiresAt,
      redirectUrl: AUTH_CONSTANTS.TOKEN_PURPOSE.RESET_PASSWORD,
    });

    const resetUrl = this.buildResetPasswordUrl(rawToken);

    await this.emailService.sendPasswordResetEmail({
      to: user.email,
      resetUrl,
      fullName: user.fullName ?? undefined,
    });

    this.logger.log(`Reset password link sent to ${user.email}`);

    return {
      message: 'If this email exists, a reset password link has been sent.',
    };
  }

  private buildResetPasswordUrl(rawToken: string): string {
    const frontendBaseUrl = this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:5173';
    const resetPasswordPath = this.configService.get<string>('app.resetPasswordPath') ?? '/reset-password';
    const resetUrl = new URL(resetPasswordPath, frontendBaseUrl);
    resetUrl.searchParams.set('token', rawToken);

    return resetUrl.toString();
  }
}
