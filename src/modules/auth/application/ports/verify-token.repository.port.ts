import { VerifyTokenEntity, VerifyTokenType } from '../../domain/verify-token.entity';

export abstract class VerifyTokenRepositoryPort {
  abstract save(token: VerifyTokenEntity): Promise<void>;
  abstract findByToken(token: string): Promise<VerifyTokenEntity | null>;
  abstract deleteByUserIdAndType(userId: string, type: VerifyTokenType): Promise<void>;
}
