export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export abstract class JwtServicePort {
  abstract signAccessToken(payload: JwtPayload): string;
  abstract verifyAccessToken(token: string): JwtPayload;
}
