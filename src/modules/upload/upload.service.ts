import { Inject, Injectable } from '@nestjs/common';
import { UPLOAD_PROVIDER } from 'src/common/constants';
import type { IUploadProvider } from 'src/common/interfaces/uploadProvider.interface';
import type { File } from 'multer';

@Injectable()
export class UploadService {
  constructor(
    @Inject(UPLOAD_PROVIDER)
    private readonly uploadProvider: IUploadProvider,
  ) {}

  async upload(files: File[], options = {}) {
    const fileLinks: string[] = [];

    for await (const file of files) {
      const key = file.originalname.split('.')[0];
      const uploadUrl = await this.uploadProvider?.upload(file.path, {
        public_id: key,
      });

      fileLinks.push(uploadUrl);
    }

    const successfulUploads = fileLinks.filter(Boolean);
    return successfulUploads;
  }
}
