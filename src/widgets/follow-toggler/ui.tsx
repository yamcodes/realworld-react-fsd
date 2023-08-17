import { Profile } from '~entities/profile';
import { FollowProfile, UnfollowProfile } from '~features/profile';
import { FollowTogglerModel } from './model';

type FollowTogglerProps = {
  profile: Profile;
  $$model: FollowTogglerModel;
};

export function FollowToggler(props: FollowTogglerProps) {
  const { $$model, profile } = props;

  return profile.following ? (
    <UnfollowProfile profile={profile} $$model={$$model.$$unfollowProfile} />
  ) : (
    <FollowProfile profile={profile} $$model={$$model.$$followProfile} />
  );
}
