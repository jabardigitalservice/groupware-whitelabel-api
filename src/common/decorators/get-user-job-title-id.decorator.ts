import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { User } from '../../models/users/entities/user.entity';

export const GetUserJobTitleId = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user.userProfile.jobTitle) {
      throw new BadRequestException('User Does Not Have A Job Title');
    }
    return req.user.userProfile.jobTitle.id;
  },
);
