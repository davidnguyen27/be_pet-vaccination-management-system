import { AuthRepositoryPort } from '@/modules/auth/application/ports/auth.repository.port';
import { createHash } from 'crypto';

export async function extractTokenInput(authRepo: AuthRepositoryPort, tokenValue: string) {
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
