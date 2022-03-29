import { EntityRepository, Repository } from 'typeorm';
import { UpdateRefreshTokenDto } from '../dto/update-refresh-token.dto';
import { UserToken } from '../entities/user-token.entity';
import { Token } from '../enums/token.enum';

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {
  async updateRefreshToken(
    oldRefreshToken: string,
    updateRefreshTokenDto: UpdateRefreshTokenDto,
  ): Promise<void> {
    const { refreshToken, expiredTime } = updateRefreshTokenDto;
    await this.update(
      { token: oldRefreshToken, tokenType: Token.REFRESH },
      { token: refreshToken, tokenType: Token.REFRESH, expiredTime },
    );
  }
}
