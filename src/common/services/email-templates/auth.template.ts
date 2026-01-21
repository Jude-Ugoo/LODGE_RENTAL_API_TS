import { SendMailDTO } from 'src/common/validations';

export enum EmailTypes {
  WELCOME = 'welcome',
  ACTIVATE = 'activate',
  PASSWORD_RESET = 'password_reset',
}

const commonTemplate = ({
  content,
  subject,
}: {
  content: string;
  subject: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${subject}</h1>
      </div>
      
      <div class="content">
        ${content}
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

const welcome = (payload: any) => {
  const subject = 'Welcome to Oko Lodge';

  const content = `
    <p>Hello <strong>${payload.name}</strong>,</p>
    <p>We are thrilled to have you on board!</p>
    <p>Welcome to our platform. Your account has been successfully created.</p>
    <p>You can now log in and start using our services.</p>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The Oko Lodge Team</p>
  `;

  const html = commonTemplate({ subject, content });

  return { subject, html };
};

const activate = (data: any) => {
  const subject = 'Account Activation';

  const content = `<p> Hello <strong>${data.name}</strong>, welcome onboard.</p><p>We are thrilled to have you on board!</p ><p>Activate your account using: </p><p><strong>${data.token}</strong></p>`;

  const html = commonTemplate({ subject, content });

  return { subject, html };
};

const passwordRest = (data: any) => {
  const subject = 'Password Reset Request';

  const content = `<p>Hello ${data.name},</p><p>We received a request to reset your password.</p><p>To reset your password, please use the following token: <strong>${data.token}</strong></p><p>If you didn't request a password reset, you can ignore this email.</p>`;

  const html = commonTemplate({ subject, content });

  return { subject, html };
};

export const getTemplate = (
  payload: SendMailDTO,
): { subject: string; html: string } => {
  const { type, data } = payload;

  switch (type) {
    case EmailTypes.WELCOME:
      return welcome(data ?? {});

    case EmailTypes.ACTIVATE:
      return activate(data ?? {});

    case EmailTypes.PASSWORD_RESET:
      return passwordRest(data ?? {});

    default:
      throw new Error(`Unsupported email template type: ${type}`);
  }
};
