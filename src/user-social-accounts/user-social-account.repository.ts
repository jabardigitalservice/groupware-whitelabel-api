import { EntityRepository, Repository } from 'typeorm';
import { UserSocialAccount } from './user-social-account.entity';

@EntityRepository(UserSocialAccount)
export class UserSocialAccountRepository extends Repository<UserSocialAccount> {}
