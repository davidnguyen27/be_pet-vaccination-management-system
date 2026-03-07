import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType } from '../../../../../generated/prisma/enums';
import { I_AUTH_REPOSITORY } from '../../domain/repositories/i-auth.repository';
import type { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { ResetPasswordDto } from '../dtos/auth.dto';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class ResetPasswordUseCase {
  constructor(@Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const user = await this.authRepo.findUserByEmail(dto.email);
    if (!user || !user.isActive || user.isDeleted) {
      throw new NotFoundException('User not found');
    }

    const otpRecord = await this.authRepo.findValidOtp(user.id, OtpType.FORGOT_PASSWORD);
    if (!otpRecord) {
      throw new BadRequestException('OTP not found or expired. Please request a new one.');
    }

    if (otpRecord.verifiedAt) {
      throw new BadRequestException('OTP already used');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('OTP expired. Please request a new one.');
    }

    const isValid = await bcrypt.compare(dto.otp, otpRecord.otpHash);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    const newPasswordHash = await bcrypt.hash(dto.newPassword, BCRYPT_SALT_ROUNDS);

    await this.authRepo.markOtpVerified(otpRecord.otpCodeId);
    await this.authRepo.updatePassword(user.id, newPasswordHash);
    await this.authRepo.revokeAllUserRefreshTokens(user.id);
  }
}
