export interface IEmailProvider {
  readonly providerKey: string;
  sendMail(options: EmailSendOptions): Promise<void>;
}

export type EmailProviderName = "smtp";

export interface ISmtpEmailConfig {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  password: string;
}

export interface IEmailConfig {
  provider: EmailProviderName;
  smtp: ISmtpEmailConfig;
}

export interface EmailSendOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}
