import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.interface';
import { AuthRepository } from '../auth.repository';
import { User } from '../../models/users/entities/user.entity';
import { AppConfigService } from '../../config/app/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtAccessTokenSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const id = payload.identifier;
    const user: User = await this.authRepository.findOne(
      { id },
      { relations: ['userProfile', 'userProfile.jobTitle'] },
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
