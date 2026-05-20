import { BadGatewayException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
import { Readable } from 'stream';

interface UploadOptions {
  folder: string;
  publicId?: string;
  transformation?: UploadApiOptions['transformation'];
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  async upload(file: Express.Multer.File, options: UploadOptions): Promise<UploadApiResponse> {
    this.validateFile(file);

    try {
      return await new Promise((resolve, reject) => {
        const uploadOptions: UploadApiOptions = {
          folder: options.folder,
          public_id: options.publicId,
          overwrite: true,
          invalidate: true,
          resource_type: 'image',
          transformation: options.transformation ?? [{ quality: 'auto', fetch_format: 'auto' }],
          format: 'webp',
        };

        const upload = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error || !result) return reject(new Error('Cloudinary upload failed'));
          resolve(result);
        });

        const source = Readable.from(file.buffer);

        source.on('error', reject);
        upload.on('error', reject);
        source.pipe(upload);
      });
    } catch (error) {
      throw this.toUploadException(error);
    }
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  private validateFile(file: Express.Multer.File): void {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const MAX_SIZE_MB = 5;

    if (!file?.buffer) {
      throw new BadRequestException('Image file is required');
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only JPEG, PNG, WEBP, GIF allowed');
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new BadRequestException(`File too large. Max ${MAX_SIZE_MB}MB`);
    }
  }

  private toUploadException(error: unknown): BadGatewayException {
    const cloudinaryError = error as { message?: string; http_code?: number; code?: string };
    const message = cloudinaryError.message ?? 'Unknown Cloudinary error';

    this.logger.error(`Cloudinary upload failed: ${message}`);

    if (/invalid cloud_name/i.test(message)) {
      return new BadGatewayException('Cloudinary config is invalid. Please check CLOUDINARY_CLOUD_NAME');
    }

    if (cloudinaryError.http_code === 401) {
      return new BadGatewayException('Cloudinary credentials are invalid. Please check API key and API secret');
    }

    return new BadGatewayException('Failed to upload image to Cloudinary');
  }
}
