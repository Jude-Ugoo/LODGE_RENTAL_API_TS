import { NotAcceptableException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import type { File } from 'multer';

export const fileFilter = (_: unknown, file: File, cb: Function) => {
  const allowedFormats = ['jpg', 'jpeg', 'png', 'pdf'];
  const extension = file?.originalname?.split('.')?.pop();

  if (!allowedFormats.includes(extension.toLowerCase())) {
    cb(
      new NotAcceptableException(
        `Invalid file type for '${file?.originalname}', expected file types includes, ${allowedFormats.join(
          ', ',
        )}`,
      ),
      false,
    );
    return;
  }

  cb(null, true);
};

const fileInterceptorOptions: MulterOptions = {
  dest: './uploads',
  limits: {
    fileSize: 314572800,
  },
  fileFilter,
};

export default fileInterceptorOptions;
