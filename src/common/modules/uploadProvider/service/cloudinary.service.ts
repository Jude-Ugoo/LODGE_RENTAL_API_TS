import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as cloudinary from 'cloudinary';
import { SUPPORTED_UPLOAD_PROVIDERS } from 'src/common/constants';

import {
  IUploadProvider,
  ICloudinaryUploadConfig,
} from 'src/common/interfaces/uploadProvider.interface';
import { removeUnusedFile } from 'src/modules/upload/helpers';

@Injectable()
export class CloudinaryUploadService implements IUploadProvider {
  logger: Logger;
  cloud: typeof cloudinary.v2 = cloudinary.v2;
  config: ICloudinaryUploadConfig | undefined;
  readonly providerKey: string = SUPPORTED_UPLOAD_PROVIDERS.CLOUDINARY;

  constructor(private readonly configService: ConfigService) {
    this.config =
      this.configService.get<ICloudinaryUploadConfig>('upload.cloudinary');
    if (!this.config) {
      throw new Error('Cloudinary configuration is missing');
    }
    this.cloud.config(this.config);

    this.logger = new Logger(CloudinaryUploadService.name);
  }

  async upload(filePath: string, options: any = {}) {
    try {
      const result = await this.cloud.uploader.upload(filePath, {
        folder: this.config?.folder ?? 'uploads',
        overwrite: true,
        ...options,
      });

      return result?.url;
    } catch (error) {
      this.logger.error({ filePath, options });
      throw new BadRequestException(error);
    } finally {
      removeUnusedFile(filePath);
    }
  }
}
