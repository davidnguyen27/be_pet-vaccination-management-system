import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType } from '@/enums';
import { VerifyOtpDto } from '../dtos/auth-req.dto';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: VerifyOtpDto): Promise<void> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const otpRecord = await this.authRepo.findValidOtp(user.id, OtpType.REGISTER);
    if (!otpRecord) {
      throw new BadRequestException('OTP not found or has expired. Please request a new one.');
    }

    if (otpRecord.verifiedAt) {
      throw new BadRequestException('OTP already used');
    }

    const isValid = await bcrypt.compare(dto.otp, otpRecord.otpHash);
    if (!isValid) throw new BadRequestException('Invalid OTP');

    await this.authRepo.markOtpVerified(otpRecord.otpCodeId);
    await this.authRepo.activateUser(user.id);
  }
}
