import { createEvent } from 'effector';
import { Profile } from '~entities/profile';
import { $$sessionModel, User } from '~entities/session';

export type OwnerModel = ReturnType<typeof createOwnerModel>;

export function createOwnerModel() {
  const init = createEvent();
  const unmounted = createEvent();
  const reset = createEvent();

  const $profile = $$sessionModel.$visitor.map((visitor) =>
    visitor ? mapVisitor(visitor) : null,
  );

  return {
    init,
    unmounted,
    reset,
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
