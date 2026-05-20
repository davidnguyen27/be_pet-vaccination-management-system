import { Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY_PORT, AuthRepositoryPort } from '../ports/auth.repository.port';

@Injectable()
export class LogoutUseCase {
  constructor(@Inject(AUTH_REPOSITORY_PORT) private readonly authRepo: AuthRepositoryPort) {}

  async execute(userId: string, tokenId?: string): Promise<void> {
    if (tokenId) {
      await this.authRepo.revokeRefreshToken(tokenId, userId);
    } else {
      await this.authRepo.revokeAllUserRefreshTokens(userId);
    }
  }
}
