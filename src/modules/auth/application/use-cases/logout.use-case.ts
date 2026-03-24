import { Inject, Injectable } from '@nestjs/common';
import { I_AUTH_REPOSITORY, type IAuthRepository } from '../../domain/i-auth.repository';

@Injectable()
export class LogoutUseCase {
  constructor(@Inject(I_AUTH_REPOSITORY) private readonly authRepo: IAuthRepository) {}

  async execute(userId: string, tokenId?: string): Promise<void> {
    if (tokenId) {
      await this.authRepo.revokeRefreshToken(tokenId, userId);
    } else {
      await this.authRepo.revokeAllUserRefreshTokens(userId);
    }
  }
}
