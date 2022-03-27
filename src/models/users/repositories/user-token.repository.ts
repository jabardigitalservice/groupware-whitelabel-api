import { EntityRepository, Repository } from 'typeorm';
import { UpdateRefreshTokenDto } from '../dto/update-refresh-token.dto';
import { UserToken } from '../entities/user-token.entity';

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {
  async updateRefreshToken(
    oldRefreshToken: string,
    updateRefreshTokenDto: UpdateRefreshTokenDto,
  ): Promise<void> {
    const { refreshToken, expiredTime } = updateRefreshTokenDto;
    await this.update(
      { refreshToken: oldRefreshToken },
      { refreshToken, expiredTime },
    );
  }
}
