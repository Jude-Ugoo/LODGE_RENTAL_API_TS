import { Environment } from '../enums/environment.enum';
import { EnvironmentVariables } from '../validations/environment.validations';
import { config } from 'dotenv';

config();

export const getEnv = () => {
  const env = process.env as any as EnvironmentVariables;
  return {
    ...env,
    isTest: env.NODE_ENV === Environment.TEST,
    isDevelopment: env.NODE_ENV === Environment.DEVELOPMENT,
    isStaging: env.NODE_ENV === Environment.STAGING,
    isProduction: env.NODE_ENV === Environment.PRODUCTION,
  };
};
