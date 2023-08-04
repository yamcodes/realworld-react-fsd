import { Profile } from '~entities/profile';
import {
  FollowProfile,
  UnfollowProfile,
  followModel,
  unfollowModel,
} from '~features/profile';

type FollowTogglerProps = {
  profile: Profile;
  $$followModel: followModel.FollowProfileModel;
  $$unfollowModel: unfollowModel.UnfollowProfileModel;
};

export function FollowToggler(props: FollowTogglerProps) {
  const { $$followModel, $$unfollowModel, profile } = props;

  return profile.following ? (
    <UnfollowProfile $$model={$$unfollowModel} />
  ) : (
    <FollowProfile $$model={$$followModel} />
  );
}
