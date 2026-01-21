import { registerAs } from "@nestjs/config";

import { SUPPORTED_EMAIL_PROVIDERS } from "../constants";
import { getEnv } from "../helpers/env.helper";

const ENV = getEnv();

export default registerAs("email", () => ({
  provider: ENV.EMAIL_PROVIDER ?? SUPPORTED_EMAIL_PROVIDERS.SMTP,
  smtp: {
    host: ENV.EMAIL_HOST,
    port: Number(ENV.EMAIL_PORT),
    secure: Number(ENV.EMAIL_PORT) === 465,
    user: ENV.EMAIL_USER,
    password: ENV.EMAIL_PASSWORD,
  },
}));
