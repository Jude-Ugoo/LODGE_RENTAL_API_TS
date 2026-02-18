import {
  PipeTransform,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import type { File } from 'multer';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly maxFileSizeMB = 5) {}

  transform(value: File[] | File) {
    if (!value || value?.length === 0) {
      throw new NotAcceptableException('No files uploaded');
    }

    const files = Array.isArray(value) ? value : [value];
    const maxSize = this.maxFileSizeMB * 1024 * 1024;

    for (const file of files) {
      if (!file) {
        throw new NotAcceptableException('Empty file detected');
      }

      if (file.size > maxSize) {
        throw new NotAcceptableException(
          `File ${file.originalname} exceeds max size of ${this.maxFileSizeMB}MB`,
        );
      }
    }

    return value;
  }
}
