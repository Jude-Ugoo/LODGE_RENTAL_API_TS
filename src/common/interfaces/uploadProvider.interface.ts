export interface IUploadProvider {
  readonly providerKey: string;
  upload(file: string, options?: Record<string, any>): Promise<string>;
}

export type UploadProviderName = 'cloudinary' | 'internal';

export interface ICloudinaryUploadConfig {
  folder?: string;
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
}

export interface InternalUploadConfig {
  dir: string;
}

export interface IUploadConfig {
  provider: UploadProviderName;
  cloudinary: ICloudinaryUploadConfig;
  internal: InternalUploadConfig;
}
