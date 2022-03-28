import { EntityRepository, Repository } from 'typeorm';
import { UserSocialAccount } from './entities/user-social-account.entity';

@EntityRepository(UserSocialAccount)
export class UserSocialAccountRepository extends Repository<UserSocialAccount> {}
