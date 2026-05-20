interface AuthEntityProps {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
}

export class AuthEntity {
  private readonly props: AuthEntityProps;

  private constructor(props: AuthEntityProps) {
    this.props = props;
  }

  static create(props: AuthEntityProps): AuthEntity {
    return new AuthEntity(props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  get accessExpiresAt(): Date {
    return this.props.accessExpiresAt;
  }

  get refreshExpiresAt(): Date {
    return this.props.refreshExpiresAt;
  }
}
