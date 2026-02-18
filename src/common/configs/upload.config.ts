import { registerAs } from '@nestjs/config';

import { getEnv } from 'src/common/helpers/env.helper';
const ENV = getEnv();

export default registerAs('upload', () => ({
  provider: ENV.UPLOAD_PROVIDER,
  cloudinary: {
    folder: ENV.CLOUDINARY_CLOUD_DEFAULT_FOLDER,
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
    secure: true,
  },
  internal: {
    dir: ENV.INTERNAL_UPLOAD_DIR,
  },
}));
