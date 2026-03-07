import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { IEmailService, SendOtpOptions } from '../../application/ports/i-email.service';

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

  async sendOtp(options: SendOtpOptions): Promise<void> {
    const subject = options.type === 'REGISTER' ? 'Verify your PVMS account' : 'Reset your PVMS password';

    const greeting = options.fullName ? `Hi ${options.fullName},` : 'Hi,';

    const body =
      options.type === 'REGISTER'
        ? `${greeting}\n\nYour verification OTP is: <strong>${options.otp}</strong>\n\nThis code expires in 10 minutes.`
        : `${greeting}\n\nYour password reset OTP is: <strong>${options.otp}</strong>\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.`;

    try {
      await this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject,
        html: `<p>${body.replace(/\n/g, '<br/>')}</p>`,
      });
      this.logger.log(`OTP email [${options.type}] sent to ${options.to}`);
    } catch (err) {
      this.logger.error(`Failed to send OTP email to ${options.to}`, err);
      throw err;
    }
  }
}
