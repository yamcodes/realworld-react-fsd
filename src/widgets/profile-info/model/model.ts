/* eslint-disable effector/no-getState */
import { Store, sample } from 'effector';
import { createAnonModel } from './anonModel';
import { createAuthModel } from './authModel';
import { createOwnerModel } from './ownerModel';
import { ProfileInfoModel } from './types';

export type ProfileInfoConfig = {
  $profileCtx: Store<'auth' | 'owner' | 'anon'>;
  $username: Store<string | null>;
};

export function createModel(config: ProfileInfoConfig): ProfileInfoModel {
  const { $profileCtx, $username } = config;

  const $$profileInfo: Record<'auth' | 'owner' | 'anon', ProfileInfoModel> = {
    anon: createAnonModel({ $username }),
    auth: createAuthModel({ $username }),
    owner: createOwnerModel(),
  };

  const init = $profileCtx.map((ctx) => $$profileInfo[ctx].init).getState();

  const unmounted = $profileCtx
    .map((ctx) => $$profileInfo[ctx].unmounted)
    .getState();

  const reset = $profileCtx.map((ctx) => $$profileInfo[ctx].reset).getState();

  const $profile = $profileCtx
    .map((ctx) => $$profileInfo[ctx].$profile)
    .getState();

  const $pending = $profileCtx
    .map((ctx) => $$profileInfo[ctx].$pending)
    .getState();

  const $error = $profileCtx.map((ctx) => $$profileInfo[ctx].$error).getState();

  sample({
    clock: init,
    target: reset,
  });

  return {
    init,
    reset,
    unmounted,
    $profile,
    $pending,
    $error,
  };
}
