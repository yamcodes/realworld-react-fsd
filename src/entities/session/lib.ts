import { UserDto } from '~shared/api/realworld';
import { User } from './types';

export function mapUser(user: UserDto): User {
  return {
    email: user.email,
    token: user.token,
    username: user.username,
    bio: user.bio,
    image: user.image,
  };
}
