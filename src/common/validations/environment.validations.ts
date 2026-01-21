import { plainToClass } from 'class-transformer';

import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { Environment } from '../enums/environment.enum';
import {
  SUPPORTED_EMAIL_PROVIDERS,
  SUPPORTED_UPLOAD_PROVIDERS,
} from '../constants';

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_DIALECT: string;

  @IsString()
  @IsNotEmpty()
  DB_SSL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_ACCESS_EXPIRES?: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES?: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_USER: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_HOST: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_PORT: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(SUPPORTED_EMAIL_PROVIDERS))
  EMAIL_PROVIDER: string;

  @IsString()
  @IsOptional()
  INTERNAL_UPLOAD_DIR: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_URL: string;

  @IsString()
  @IsOptional()
  UPLOAD_PROVIDER: string;

  // CLOUDINARY RELATED CONFIGS
  @ValidateIf(
    (o) => o.UPLOAD_PROVIDER === SUPPORTED_UPLOAD_PROVIDERS.CLOUDINARY,
  )
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_KEY: string;

  @ValidateIf(
    (o) => o.UPLOAD_PROVIDER === SUPPORTED_UPLOAD_PROVIDERS.CLOUDINARY,
  )
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_API_SECRET: string;

  @ValidateIf(
    (o) => o.UPLOAD_PROVIDER === SUPPORTED_UPLOAD_PROVIDERS.CLOUDINARY,
  )
  @IsString()
  @IsNotEmpty()
  CLOUDINARY_CLOUD_NAME: string;

  @IsString()
  @IsOptional()
  CLOUDINARY_CLOUD_DEFAULT_FOLDER: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
