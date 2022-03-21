import { User } from '../../users/entities/user.entity';
import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';
import { UserProfile } from '../../user-profiles/user-profile.entity';
import { UserSocialAccount } from '../../user-social-accounts/user-social-account.entity';

define(User, () => {
  const user = new User();

  user.name = faker.name.findName();
  user.email = nanoid() + faker.internet.email();
  user.password = process.env.DEFAULT_PASSWORD;
  user.isActive = Boolean(Math.floor(Math.random() * 2));

  return user;
});

define(UserProfile, () => {
  const userProfile = new UserProfile();
  const gender = ['M', 'F'];
  const employmentStatus = ['Employee', 'Intern'];
  const randomNumberForBirthDate = Math.floor(Math.random() * 38) + 25;

  userProfile.birthDate = faker.date.past(randomNumberForBirthDate);
  userProfile.birthPlace = faker.address.city();
  userProfile.gender = gender[Math.floor(Math.random() * 2)];
  userProfile.employmentStatus =
    employmentStatus[Math.floor(Math.random() * 2)];
  userProfile.isPns = Boolean(Math.floor(Math.random() * 2));

  return userProfile;
});

define(UserSocialAccount, () => {
  const userSocialAccount = new UserSocialAccount();
  return userSocialAccount;
});
