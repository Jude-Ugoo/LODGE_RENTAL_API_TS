import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { getTemplate } from './email-templates/auth.template';
import { EMAIL_PROVIDER } from '../constants';
import type {
  EmailSendOptions,
  IEmailProvider,
} from '../interfaces/emailProvider.interface';
import { SendMailDTO } from '../validations';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: IEmailProvider,
  ) {}

  async sendEmail(payload: SendMailDTO) {
    if (!payload?.data) {
      throw new Error('Missing email data in payload');
    }

    const { data } = payload;
    Logger.debug(JSON.stringify(data));

    const template = getTemplate(payload);
    const { subject, html } = template;

    const options: EmailSendOptions = {
      from: `${this.configService.get('EMAIL_USER')}`,
      to: data.email,
      subject,
      html,
    };

    try {
      await this.emailProvider.sendMail(options);
      Logger.debug('Email sent successfully.');
    } catch (error) {
      Logger.error('Error sending email.');
      throw error;
    }
  }
}
