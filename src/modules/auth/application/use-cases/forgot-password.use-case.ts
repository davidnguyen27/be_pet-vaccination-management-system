import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType } from '../../../../../generated/prisma/enums';
import { I_AUTH_REPOSITORY } from '../../domain/repositories/i-auth.repository';
import type { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { I_EMAIL_SERVICE } from '../ports/i-email.service';
import type { IEmailService } from '../ports/i-email.service';
import { ForgotPasswordDto } from '../dtos/auth.dto';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.authRepo.findUserByEmail(dto.email);
    // Always return same message to prevent user enumeration
    if (!user || !user.isActive || user.isDeleted) {
      return;
    }

    await this.authRepo.invalidatePreviousOtps(user.id, OtpType.FORGOT_PASSWORD);

    const otp = this.generateOtp(OTP_LENGTH);
    const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createOtp({
      userId: user.id,
      type: OtpType.FORGOT_PASSWORD,
      otpHash,
      expiresAt,
    });

    await this.emailService.sendOtp({
      to: dto.email,
      otp,
      type: 'FORGOT_PASSWORD',
      fullName: user.fullName ?? undefined,
    });

    this.logger.log(`Forgot-password OTP sent to ${dto.email}`);
  }

  private generateOtp(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }
}
