import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { extractTokenInput } from '@/shared/helpers/extract-token-input.helper';

@Injectable()
export class ValidateTokenUseCase {
  constructor(@Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository) {}

  async execute(token: string): Promise<{ isValid: true }> {
    const tokenRecord = await extractTokenInput(this.authRepo, token);

    if (!tokenRecord || tokenRecord.redirectUrl !== AUTH_CONSTANTS.TOKEN_PURPOSE.RESET_PASSWORD) {
      throw new BadRequestException('Reset password link is invalid.');
    }

    if (tokenRecord.usedAt) {
      throw new BadRequestException('Reset password link has already been used.');
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Reset password link has expired. Please request a new one.');
    }

    return { isValid: true };
  }
}
