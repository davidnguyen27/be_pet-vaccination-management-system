import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType } from '@/enums';
import { I_AUTH_REPOSITORY } from '../../domain/i-auth.repository';
import type { IAuthRepository } from '../../domain/i-auth.repository';
import { ResetPasswordDto } from '../dtos/auth-req.dto';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
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

    const isValid = await bcrypt.compare(dto.otp, otpRecord.otpHash);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    const newPasswordHash = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    await this.authRepo.markOtpVerified(otpRecord.otpCodeId);
    await this.authRepo.changePassword(user.id, newPasswordHash);
    await this.authRepo.revokeAllUserRefreshTokens(user.id);
  }
}
