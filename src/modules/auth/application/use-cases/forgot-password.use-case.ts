import { Inject, Injectable, Logger } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { ForgotPasswordDto } from '../dtos/auth-req.dto';
import { I_EMAIL_SERVICE, type IEmailService } from '../ports/i-email.service';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.isActive || user.isDeleted) {
      return;
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

    const frontendBaseUrl = (this.configService.get<string>('app.frontendUrl') ?? 'http://localhost:5173').replace(
      /\/$/,
      '',
    );
    const resetUrl = `${frontendBaseUrl}/reset-password?token=${rawToken}`;

    await this.emailService.sendResetPasswordLink({
      to: user.email,
      resetUrl,
      fullName: user.fullName ?? undefined,
    });

    this.logger.log(`Reset password link sent to ${user.email}`);
  }
}
