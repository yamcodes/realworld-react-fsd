import { ProfileDto } from '~shared/api/realworld';

export function mapProfile(profile: ProfileDto): ProfileDto {
  return {
    username: profile.username,
    bio: profile.bio,
    image: profile.image,
    following: profile.following,
  };
}
