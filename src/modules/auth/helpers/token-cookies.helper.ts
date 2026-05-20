import { AuthTokensResponseDTO } from '@/modules/auth/presentation/http/dto/auth.dto';
import { CookieOptions, Response } from 'express';

type SetTokenCookiesOption = {
  domain?: string;
};

export const setTokenCookies = (res: Response, tokens: AuthTokensResponseDTO, option?: SetTokenCookiesOption) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const base: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    ...(option?.domain ? { domain: option.domain } : {}),
  };
  const refreshMaxAge = Math.max(0, tokens.refreshExpiresAt.getTime() - Date.now());

  res.cookie('refresh_token', tokens.refreshToken, {
    ...base,
    maxAge: refreshMaxAge,
  });

  return {
    accessToken: tokens.accessToken,
  };
};
