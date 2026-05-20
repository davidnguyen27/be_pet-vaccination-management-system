import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';
import { AUTH_CONSTANTS } from '@/constants/auth';

@Injectable()
export class VerifyEmailUseCase {
  constructor(@Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort) {}

  async execute(token: string): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const tokenRecord = await this.authRepo.findValidVerifyTokenByHash(tokenHash);

    if (!tokenRecord) {
      throw new BadRequestException('Verification link is invalid.');
    }

    if (tokenRecord.redirectUrl !== AUTH_CONSTANTS.TOKEN_PURPOSE.VERIFY_EMAIL) {
      throw new BadRequestException('Verification link is invalid.');
    }

    if (tokenRecord.usedAt) {
      throw new BadRequestException('Verification link has already been used.');
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('Verification link has expired. Please request a new one.');
    }

    await this.authRepo.markVerifyTokenUsed(tokenRecord.id);
    await this.authRepo.activateUser(tokenRecord.userId);
  }
}
