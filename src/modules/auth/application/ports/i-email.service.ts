import { OtpType } from '@/enums';

export interface SendOtpOptions {
  to: string;
  otp: string;
  type: OtpType;
  fullName?: string;
}

export interface IEmailService {
  sendOtp(options: SendOtpOptions): Promise<void>;
}

export const I_EMAIL_SERVICE = Symbol('IEmailService');
