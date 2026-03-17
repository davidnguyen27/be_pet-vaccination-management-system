import { AuthTokensResponseDto } from '@/modules/auth/application/dtos/auth-res.dto';
import { CookieOptions, Response } from 'express';

export const setTokenCookies = (res: Response, tokens: AuthTokensResponseDto): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  const base: CookieOptions = { httpOnly: true, secure: isProduction, sameSite: 'strict' };

  res.cookie('access_token', tokens.accessToken, {
    ...base,
    maxAge: tokens.accessExpiresAt.getTime() - Date.now(),
  });
  res.cookie('refresh_token', tokens.refreshToken, {
    ...base,
    maxAge: tokens.refreshExpiresAt.getTime() - Date.now(),
  });
};
