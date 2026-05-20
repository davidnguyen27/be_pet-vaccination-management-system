import { RefreshTokenEntity } from '../../domain/refresh-token.entity';

export abstract class RefreshTokenRepositoryPort {
  abstract save(token: RefreshTokenEntity): Promise<void>;
  abstract findByToken(token: string): Promise<RefreshTokenEntity | null>;
  abstract revokeAllByUserId(userId: string): Promise<void>;
}
