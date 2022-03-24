import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategy/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserTokenRepository } from '../models/users/repositories/user-token.repository';
import { AppConfigService } from '../config/app/config.service';
import { AppConfigModule } from '../config/app/config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    AppConfigModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule, AppConfigModule],
      inject: [ConfigService, AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtAccessTokenSecret,
        signOptions: {
          expiresIn: appConfigService.jwtAccessTokenExpiresIn,
        },
      }),
    }),
    TypeOrmModule.forFeature([AuthRepository, UserTokenRepository]),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
