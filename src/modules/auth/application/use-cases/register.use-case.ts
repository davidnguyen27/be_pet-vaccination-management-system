import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { OtpType } from '../../../../../generated/prisma/enums';
import { I_AUTH_REPOSITORY } from '../../domain/repositories/i-auth.repository';
import type { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import { I_EMAIL_SERVICE } from '../ports/i-email.service';
import type { IEmailService } from '../ports/i-email.service';
import { RegisterDto } from '../dtos/auth.dto';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_EMAIL_SERVICE) private readonly emailService: IEmailService,
  ) {}

  async execute(dto: RegisterDto): Promise<void> {
    const existing = await this.authRepo.findUserByEmail(dto.email);
    if (existing && existing.isActive) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user =
      existing ??
      (await this.authRepo.createUser({
        email: dto.email,
        passwordHash,
        roleCode: 'OWN',
        fullName: dto.fullName,
      }));

    // Invalidate any existing OTPs for this user/type
    await this.authRepo.invalidatePreviousOtps(user.id, OtpType.REGISTER);

    // Generate OTP
    const otp = this.generateOtp(OTP_LENGTH);
    const otpHash = await bcrypt.hash(otp, BCRYPT_SALT_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.authRepo.createOtp({
      userId: user.id,
      type: OtpType.REGISTER,
      otpHash,
      expiresAt,
    });

    await this.emailService.sendOtp({
      to: dto.email,
      otp,
      type: 'REGISTER',
      fullName: dto.fullName,
    });

    this.logger.log(`Registration OTP sent to ${dto.email}`);
  }

  private generateOtp(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }
}
