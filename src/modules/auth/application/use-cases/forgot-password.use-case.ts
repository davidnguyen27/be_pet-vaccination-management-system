import { Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { OtpType } from '@/enums';
import { I_AUTH_REPOSITORY } from '../../domain/i-auth.repository';
import type { IAuthRepository } from '../../domain/i-auth.repository';
import { I_EMAIL_SERVICE } from '../ports/i-email.service';
import type { IEmailService } from '../ports/i-email.service';
import { ForgotPasswordDto } from '../dtos/auth-req.dto';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';

@Injectable()
export class ForgotPasswordUseCase {
  private readonly logger = new Logger(ForgotPasswordUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    // Always return same message to prevent user enumeration
    if (!user || !user.isActive || user.isDeleted) {
      return;
    }

    await this.authRepo.invalidatePreviousOtps(user.id, OtpType.FORGOT_PASSWORD);

    const otp = this.generateOtp(AUTH_CONSTANTS.OTP_LENGTH);
    const otpHash = await bcrypt.hash(otp, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createOtp({
      userId: user.id,
      type: OtpType.FORGOT_PASSWORD,
      otpHash,
      expiresAt,
    });

    await this.emailService.sendOtp({
      to: dto.email,
      otp,
      type: OtpType.FORGOT_PASSWORD,
      fullName: user.fullName ?? undefined,
    });

    this.logger.log(`Forgot-password OTP sent to ${dto.email}`);
  }

  private generateOtp(length: number): string {
    return Array.from({ length }, () => randomInt(0, 10)).join('');
  }
}
