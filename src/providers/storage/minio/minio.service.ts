import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as randomstring from 'randomstring';
import { MinioConfigService } from '../../../config/storage/minio-client/config.service';

@Injectable()
export class MinioProviderService {
  constructor(
    private minioConfigService: MinioConfigService,
    private minio: MinioService,
  ) {}

  private get bucket(): string {
    return this.minioConfigService.bucket;
  }

  async upload(file: Express.Multer.File): Promise<any> {
    const randomString = randomstring.generate(30);
    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${randomString}.${fileExtension}`;
    const fileBuffer = file.buffer;

    try {
      await this.minio.client.putObject(this.bucket, fileName, fileBuffer);

      return {
        path: fileName,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(file: string): Promise<any> {
    try {
      await this.minio.client.removeObject(this.bucket, file);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
