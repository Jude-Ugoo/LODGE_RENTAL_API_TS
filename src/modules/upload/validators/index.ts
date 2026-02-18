import { Options as MulterOptions } from 'multer';

export const uploadValidator: MulterOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_, file, callback) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(null, false);
    }

    callback(null, true);
  },
};
