import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import {
  EmailServicePort,
  SendResetPasswordOptions,
  SendVerificationOptions,
} from '../../application/ports/email.service.port';

@Injectable()
export class MailServiceImpl extends EmailServicePort {
  private readonly logger = new Logger(MailServiceImpl.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<boolean>('email.secure'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
    });
    this.from = this.configService.get<string>('email.from') ?? 'PVMS <noreply@pvms.vn>';
  }

  async sendVerificationEmail(options: SendVerificationOptions): Promise<void> {
    const greeting = options.fullName ? `Hi ${options.fullName},` : 'Hi,';
    const subject = 'Verify your PVMS account';
    const body = `${greeting}\n\nPlease click the link below to verify your account:\n${options.verifyUrl}\n\nThis link expires in 10 minutes.`;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject,
        html: `<p>${body.replace(/\n/g, '<br/>')}</p>`,
      });
      this.logger.log(`Verification link email sent to ${options.to}`);
    } catch (err) {
      this.logger.error(`Failed to send verification link email to ${options.to}`, err);
      throw err;
    }
  }

  async sendPasswordResetEmail(options: SendResetPasswordOptions): Promise<void> {
    const greeting = options.fullName ? `Hi ${options.fullName},` : 'Hi,';
    const subject = 'Reset your PVMS password';
    const body = `${greeting}\n\nPlease click the link below to reset your password:\n${options.resetUrl}\n\nThis link expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject,
        text: body,
        html: this.buildResetPasswordHtml(greeting, options.resetUrl),
      });
      this.logger.log(`Reset password link email sent to ${options.to}`);
    } catch (err) {
      this.logger.error(`Failed to send reset password link email to ${options.to}`, err);
      throw err;
    }
  }

  private buildResetPasswordHtml(greeting: string, resetUrl: string): string {
    const escapedResetUrl = this.escapeHtml(resetUrl);

    return `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <p>${this.escapeHtml(greeting)}</p>
        <p>Click the button below to reset your password.</p>
        <p>
          <a href="${escapedResetUrl}" style="display: inline-block; padding: 10px 16px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;">
            Reset password
          </a>
        </p>
        <p>If the button does not work, open this link in your browser:</p>
        <p><a href="${escapedResetUrl}">${escapedResetUrl}</a></p>
        <p>This link expires in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
