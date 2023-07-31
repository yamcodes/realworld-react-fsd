import { ProfileDto } from '~shared/api/realworld';
import { Profile } from './types';

export function mapProfile(profile: ProfileDto): Profile {
  return {
    username: profile.username,
    bio: profile.bio,
    image: profile.image,
    following: profile.following,
  };
}
