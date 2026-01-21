import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailOptions } from 'nodemailer';

import { SUPPORTED_EMAIL_PROVIDERS } from 'src/common/constants';
import {
  EmailSendOptions,
  IEmailProvider,
  ISmtpEmailConfig,
} from 'src/common/interfaces/emailProvider.interface';

@Injectable()
export class SmtpEmailProvider implements IEmailProvider {
  readonly providerKey: string = SUPPORTED_EMAIL_PROVIDERS.SMTP;
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(SmtpEmailProvider.name);
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<ISmtpEmailConfig>('email.smtp');

    if (
      !config ||
      !config.host ||
      typeof config.port !== 'number' ||
      !config.user ||
      !config.password
    ) {
      throw new Error(
        'Missing or incomplete SMTP email configuration (email.smtp)',
      );
    }

    this.transporter = nodemailer.createTransport({
      host: config?.host,
      port: config?.port,
      secure: config?.secure ?? false,
      auth: {
        user: config?.user,
        pass: config?.password,
      },
    });

    this.from = config?.user;
  }

  async sendMail(options: EmailSendOptions): Promise<void> {
    const { to, subject, html, from } = options;
    const mailOptions: SendMailOptions = {
      from: from ?? this.from,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.debug('Email sent successfully.');
    } catch (error) {
      this.logger.error('Error sending email.', error as any);
      throw error;
    }
  }
}
