import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { extractTokenInput } from '@/modules/auth/helpers/extract-token-input.helper';

export interface ResetPasswordCommand {
  token: string;
  newPassword: string;
  confirmPassword?: string;
}

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort,
    @Inject(UserRepositoryPort) private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    if (command.confirmPassword !== undefined && command.confirmPassword !== command.newPassword) {
      throw new BadRequestException('Password confirmation does not match.');
    }

    const tokenRecord = await extractTokenInput(this.authRepo, command.token);

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

    const newPasswordHash = await bcrypt.hash(command.newPassword, AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS);

    await this.authRepo.markVerifyTokenUsed(tokenRecord.id);
    await this.authRepo.changePassword(user.id, newPasswordHash);
    await this.authRepo.revokeAllUserRefreshTokens(user.id);
  }
}
