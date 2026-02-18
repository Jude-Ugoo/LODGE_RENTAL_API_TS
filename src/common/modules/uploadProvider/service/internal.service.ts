import { Injectable } from '@nestjs/common';
import { SUPPORTED_UPLOAD_PROVIDERS } from 'src/common/constants';
import { IUploadProvider } from 'src/common/interfaces/uploadProvider.interface';

@Injectable()
export class InternalUploadService implements IUploadProvider {
  readonly providerKey: string = SUPPORTED_UPLOAD_PROVIDERS.INTERNAL;

  constructor() {}

  async upload(file: string, options?: Record<string, any>) {
    return '';
  }
}
