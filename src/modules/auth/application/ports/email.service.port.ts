export interface SendVerificationOptions {
  to: string;
  verifyUrl: string;
  fullName?: string;
}

export interface SendResetPasswordOptions {
  to: string;
  resetUrl: string;
  fullName?: string;
}

export abstract class EmailServicePort {
  abstract sendVerificationEmail(options: SendVerificationOptions): Promise<void>;
  abstract sendPasswordResetEmail(options: SendResetPasswordOptions): Promise<void>;
}

export const EMAIL_SERVICE_PORT = Symbol('EmailServicePort');
