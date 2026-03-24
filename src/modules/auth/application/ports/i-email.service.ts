export interface SendVerificationLink {
  to: string;
  verifyUrl: string;
  fullName?: string;
}

export interface SendResetPasswordLink {
  to: string;
  resetUrl: string;
  fullName?: string;
}

export interface IEmailService {
  sendVerificationLink(options: SendVerificationLink): Promise<void>;
  sendResetPasswordLink(options: SendResetPasswordLink): Promise<void>;
}

export const I_EMAIL_SERVICE = Symbol('IEmailService');
