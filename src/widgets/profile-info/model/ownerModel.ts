import { createEvent, sample } from 'effector';
import { Profile } from '~entities/profile';
import { $$sessionModel, User } from '~entities/session';
import { createNavigateMobel } from '../lib';

export type ProfileInfoOwnerModel = ReturnType<typeof createOwnerModel>;

export function createOwnerModel() {
  const init = createEvent();
  const unmounted = createEvent();
  const navigateToSettings = createEvent();

  const $$navigateToSettings = createNavigateMobel({ path: '/settings' });

  const $profile = $$sessionModel.$visitor.map((visitor) =>
    visitor ? mapVisitor(visitor) : null,
  );

  sample({
    clock: navigateToSettings,
    target: $$navigateToSettings.navigate,
  });

  return {
    init,
    unmounted,
    navigateToSettings,
    $profile,
  };
}

function mapVisitor(visitor: User): Profile {
  return {
    username: visitor.username,
    bio: visitor.bio,
    image: visitor.image,
    following: false,
  };
}
