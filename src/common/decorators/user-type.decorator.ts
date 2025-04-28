import { SetMetadata } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt';

export const USER_TYPE = 'user_type';

export type UserTypeValidator = (user: JwtPayload) => boolean;

export const UserType = (validator: UserTypeValidator) => SetMetadata(USER_TYPE, validator);
