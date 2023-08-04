import { createEvent, createStore } from 'effector';
import { debug } from 'patronum';
import { Profile } from '~entities/profile';
import { $$sessionModel, User } from '~entities/session';
import { ProfileInfoModel } from './types';

export function createOwnerModel(): ProfileInfoModel {
  const init = createEvent();
  const unmounted = createEvent();
  const reset = createEvent();

  const $profile = $$sessionModel.$visitor.map((visitor) =>
    visitor ? mapVisitor(visitor) : null,
  );

  const $pending = createStore(false);
  const $error = createStore<unknown>(null);

  debug({ trace: true }, $profile);

  return {
    init,
    unmounted,
    reset,
    $profile,
    $pending,
    $error,
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
