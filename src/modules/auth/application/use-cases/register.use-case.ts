import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { OtpType, RoleCode } from '@/enums';
import { I_AUTH_REPOSITORY } from '../../domain/i-auth.repository';
import type { IAuthRepository } from '../../domain/i-auth.repository';
import { I_EMAIL_SERVICE } from '../ports/i-email.service';
import type { IEmailService } from '../ports/i-email.service';
import { RegisterDto } from '../dtos/auth-req.dto';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}

  async execute(dto: RegisterDto): Promise<void> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing && existing.isActive) {
      throw new ConflictException('Email has already been registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    if (existing) {
      await this.authRepo.updatePassword(existing.id, passwordHash);
    }

    const user =
      existing ??
      (await this.userRepo.create({
        email: dto.email,
        passwordHash,
        roleCode: RoleCode.OWN,
        fullName: dto.fullName,
      }));

    // Invalidate any existing OTPs for this user/type
    await this.authRepo.invalidatePreviousOtps(user.id, OtpType.REGISTER);

    // Generate OTP
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
      to: dto.email,
      otp,
      type: OtpType.REGISTER,
      fullName: dto.fullName,
    });

    this.logger.log(`Registration OTP sent to ${dto.email}`);
  }

  private generateOtp(length: number): string {
    return Array.from({ length }, () => randomInt(0, 10)).join('');
  }
}
