import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../authentication/auth.module';
import { MinioProviderModule } from '../../providers/storage/minio/minio.module';
import { LogbooksController } from './logbooks.controller';
import { LogbooksRepository } from './logbooks.repository';
import { LogbooksService } from './logbooks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogbooksRepository]),
    AuthModule,
    MinioProviderModule,
  ],
  controllers: [LogbooksController],
  providers: [LogbooksService],
})
export class LogbooksModule {}
