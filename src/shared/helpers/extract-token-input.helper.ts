import { IAuthRepository } from '@/modules/auth/domain/i-auth.repository';
import { createHash } from 'crypto';

export async function extractTokenInput(authRepo: IAuthRepository, tokenValue: string) {
  const normalizedToken = tokenValue.trim();
  const tokenHash = createHash('sha256').update(normalizedToken).digest('hex');

  const recordByRawToken = await authRepo.findValidVerifyTokenByHash(tokenHash);
  if (recordByRawToken) return recordByRawToken;

  const looksLikeSha256Hex = /^[a-fA-F0-9]{64}$/.test(normalizedToken);
  if (looksLikeSha256Hex) {
    return authRepo.findValidVerifyTokenByHash(normalizedToken.toLowerCase());
  }
  return null;
}
