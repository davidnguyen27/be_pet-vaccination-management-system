export class AuthTokensResponseDto {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;

  constructor(accessToken: string, refreshToken: string, accessExpiresAt: Date, refreshExpiresAt: Date) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessExpiresAt = accessExpiresAt;
    this.refreshExpiresAt = refreshExpiresAt;
  }
}
