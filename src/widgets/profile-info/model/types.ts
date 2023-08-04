import { Event, Store } from 'effector';
import { Profile } from '~entities/profile';

export type ProfileInfoModel = {
  init: Event<void>;
  unmounted: Event<void>;
  reset: Event<void>;
  $profile: Store<Profile | null>;
  $pending: Store<boolean>;
  $error: Store<unknown>;
};
