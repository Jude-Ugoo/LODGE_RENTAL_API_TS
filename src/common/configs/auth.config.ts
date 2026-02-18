import { registerAs } from '@nestjs/config';
import { getEnv } from 'src/common/helpers/env.helper';

const ENV = getEnv();

export default registerAs('auth', () => ({
  jwt: {
    secret: ENV.JWT_SECRET,
    signOptions: {
      expiresIn: ENV.JWT_ACCESS_EXPIRES || '1h',
    },
  },

//   google: {
//     clientId: ENV.GOOGLE_CLIENT_ID,
//     clientSecret: ENV.GOOGLE_CLIENT_SECRET,
//     callbackUrl: ENV.GOOGLE_CALLBACK_URL,
//   },
}));
