import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { I_EMAIL_SERVICE, type IEmailService } from '../ports/i-email.service';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResendEmailUseCase {
  private readonly logger = new Logger(ResendEmailUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
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
      redirectUrl: AUTH_CONSTANTS.TOKEN_PURPOSE.VERIFY_EMAIL,
    });

    const backendBaseUrl = this.configService.get<string>('app.publicUrl') ?? 'http://localhost:3000';
    const verifyUrl = `${backendBaseUrl}/auth/verify-email?token=${rawToken}`;

    await this.emailService.sendVerificationLink({
      to: email,
      verifyUrl,
      fullName: user.fullName ?? undefined,
    });

    this.logger.log(`Resend verification link sent to ${email}`);
  }
}
