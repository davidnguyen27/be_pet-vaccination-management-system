export interface AuthJwtPayload {
  sub: string;
  email: string;
  roleCode: string;
  jti?: string;
  iat?: number;
  exp?: number;
}
