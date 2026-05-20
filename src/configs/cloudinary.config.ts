import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return cloudinary.config({
      cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME')?.trim(),
      api_key: config.get<string>('CLOUDINARY_API_KEY')?.trim(),
      api_secret: config.get<string>('CLOUDINARY_API_SECRET')?.trim(),
    });
  },
};
