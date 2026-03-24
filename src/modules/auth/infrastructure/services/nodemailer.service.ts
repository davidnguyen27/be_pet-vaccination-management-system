import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailService, SendResetPasswordLink, SendVerificationLink } from '../../application/ports/i-email.service';

@Injectable()
export class NodemailerService implements IEmailService {
  private readonly logger = new Logger(NodemailerService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
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

  async sendVerificationLink(options: SendVerificationLink): Promise<void> {
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

  async sendResetPasswordLink(options: SendResetPasswordLink): Promise<void> {
    const greeting = options.fullName ? `Hi ${options.fullName},` : 'Hi,';
    const subject = 'Reset your PVMS password';
    const body = `${greeting}\n\nPlease click the link below to reset your password:\n${options.resetUrl}\n\nThis link expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject,
        html: `<p>${body.replace(/\n/g, '<br/>')}</p>`,
      });
      this.logger.log(`Reset password link email sent to ${options.to}`);
    } catch (err) {
      this.logger.error(`Failed to send reset password link email to ${options.to}`, err);
      throw err;
    }
  }
}
