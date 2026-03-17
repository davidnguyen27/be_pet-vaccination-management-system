import { randomInt } from 'crypto';

export function generateOtp(length: number = 6): string {
  return Array.from({ length }, () => randomInt(0, 10)).join('');
}
