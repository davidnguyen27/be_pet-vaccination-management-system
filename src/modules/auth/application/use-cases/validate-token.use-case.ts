import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { AUTH_CONSTANTS } from '@/constants/auth';
import { extractTokenInput } from '@/modules/auth/helpers/extract-token-input.helper';

@Injectable()
export class ValidateTokenUseCase {
  constructor(@Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort) {}

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
