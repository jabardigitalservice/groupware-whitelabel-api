import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as randomstring from 'randomstring';
import lang from '../../../common/language/configuration';
import { MinioConfigService } from '../../../config/storage/minio-client/config.service';

@Injectable()
export class MinioProviderService {
  constructor(
    private minioConfigService: MinioConfigService,
    private minio: MinioService,
  ) {}

  async upload(file: Express.Multer.File): Promise<any> {
    const bucket = this.minioConfigService.bucket;

    const randomString = randomstring.generate(30);
    const fileExtension = file.mimetype.split('/')[1];

    const fileName = `${randomString}.${fileExtension}`;
    const fileBuffer = file.buffer;

    try {
      await this.minio.client.putObject(bucket, fileName, fileBuffer);

      return {
        url: this.minioConfigService.url + '/' + fileName,
        path: fileName,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        lang.__('common.image.file.upload.error'),
      );
    }
  }
}
