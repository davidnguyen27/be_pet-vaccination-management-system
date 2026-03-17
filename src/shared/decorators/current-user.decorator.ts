import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  roleCode: string;
  jti?: string; // refresh token ID, present only in refresh JWTs
  iat?: number;
  exp?: number;
}

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): JwtPayload => {
  const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
  return request.user;
});
