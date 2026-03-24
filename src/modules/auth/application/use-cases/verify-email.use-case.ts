import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';
import { AUTH_CONSTANTS } from '@/constants/auth';

@Injectable()
export class VerifyEmailUseCase {
  constructor(@Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository) {}

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
