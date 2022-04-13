import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinioConfigModule } from '../../config/storage/minio-client/config.module';
import { MinioProviderModule } from '../../providers/storage/minio/minio.module';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProfileRepository } from '../user-profiles/user-profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UserProfileRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MinioConfigModule,
    MinioProviderModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [PassportModule],
})
export class UserModule {}
