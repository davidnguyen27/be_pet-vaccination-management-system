export interface SendOtpOptions {
  to: string;
  otp: string;
  type: 'REGISTER' | 'FORGOT_PASSWORD';
  fullName?: string;
}

export interface IEmailService {
  sendOtp(options: SendOtpOptions): Promise<void>;
}

export const I_EMAIL_SERVICE = Symbol('IEmailService');
