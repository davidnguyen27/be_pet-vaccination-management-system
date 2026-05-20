import type { Request } from 'express';

export function getRequestInfo(req: Request) {
  const forwarded = req.headers['x-forwarded-for'];
  const ipAddress =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() ?? req.socket.remoteAddress;

  return {
    ipAddress: ipAddress,
    userAgent: req.headers['user-agent'] ?? 'unknown',
  };
}
