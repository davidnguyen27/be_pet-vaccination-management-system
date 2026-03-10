import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { OtpType } from '@/enums';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { I_EMAIL_SERVICE, type IEmailService } from '../ports/i-email.service';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';
import { AUTH_CONSTANTS } from '@/constants/auth';

@Injectable()
export class ResendTokenUseCase {
  private readonly logger = new Logger(ResendTokenUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.isActive) throw new BadRequestException('Account is already verified');

    await this.authRepo.invalidatePreviousOtps(user.id, OtpType.REGISTER);

    const otp = this.generateOtp(AUTH_CONSTANTS.OTP_LENGTH);
    const otpHash = await bcrypt.hash(otp, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createOtp({
      userId: user.id,
      type: OtpType.REGISTER,
      otpHash,
      expiresAt,
    });

    await this.emailService.sendOtp({
      to: email,
      otp,
      type: OtpType.REGISTER,
      fullName: user.fullName ?? undefined,
    });

    this.logger.log(`Resend OTP sent to ${email}`);
  }

  private generateOtp(length: number): string {
    return Array.from({ length }, () => randomInt(0, 10)).join('');
  }
}
