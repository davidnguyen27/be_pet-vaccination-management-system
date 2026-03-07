import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType } from '../../../../../generated/prisma/enums';
import { I_AUTH_REPOSITORY } from '../../domain/repositories/i-auth.repository';
import type { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { VerifyOtpDto } from '../dtos/auth.dto';

@Injectable()
export class VerifyOtpUseCase {
  constructor(@Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository) {}

  async execute(dto: VerifyOtpDto): Promise<void> {
    const user = await this.authRepo.findUserByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const otpRecord = await this.authRepo.findValidOtp(user.id, OtpType.REGISTER);
    if (!otpRecord) {
      throw new BadRequestException('OTP not found or has expired. Please request a new one.');
    }

    if (otpRecord.verifiedAt) {
      throw new BadRequestException('OTP already used');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    const isValid = await bcrypt.compare(dto.otp, otpRecord.otpHash);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    await this.authRepo.markOtpVerified(otpRecord.otpCodeId);
    await this.authRepo.activateUser(user.id);
  }
}
