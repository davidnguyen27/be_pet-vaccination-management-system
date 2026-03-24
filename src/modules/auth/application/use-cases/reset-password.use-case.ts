import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { I_AUTH_REPOSITORY } from '../../domain/i-auth.repository';
import type { IAuthRepository } from '../../domain/i-auth.repository';
import { ResetPasswordDto } from '../dtos/auth-req.dto';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { I_USER_REPOSITORY, type IUserRepository } from '@/modules/user/domain/i-user.repository';
import { extractTokenInput } from '@/shared/helpers/extract-token-input.helper';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository,
    @Inject(I_USER_REPOSITORY) private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const tokenRecord = await extractTokenInput(this.authRepo, dto.token);

    if (!tokenRecord) {
      throw new BadRequestException('Reset password link is invalid.');
    }

    if (tokenRecord.redirectUrl !== AUTH_CONSTANTS.TOKEN_PURPOSE.RESET_PASSWORD) {
      throw new BadRequestException('Reset password link is invalid.');
    }

    if (tokenRecord.usedAt) {
      throw new BadRequestException('Reset password link has already been used.');
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Reset password link has expired. Please request a new one.');
    }

    const user = await this.userRepo.findById(tokenRecord.userId);
    if (!user || !user.isActive || user.isDeleted) {
      throw new BadRequestException('Invalid reset password request.');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    await this.authRepo.markVerifyTokenUsed(tokenRecord.id);
    await this.authRepo.changePassword(user.id, newPasswordHash);
    await this.authRepo.revokeAllUserRefreshTokens(user.id);
  }
}
