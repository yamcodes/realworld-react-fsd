import { createEffect, createStore, sample } from 'effector';
import { setSecurityDataFx } from '~shared/api/realworld';
import { sessionLoadFx } from './api';

enum AuthStatus {
  Initial = 0,
  Pending,
  Anonymous,
  Authenticated,
}

const $auth = createStore(AuthStatus.Initial, { name: 'auth' });

$auth.on(sessionLoadFx, (status) => {
  if (status === AuthStatus.Initial) return AuthStatus.Pending;
  return status;
});

$auth.on(sessionLoadFx.done, () => AuthStatus.Authenticated);
$auth.on(sessionLoadFx.fail, () => AuthStatus.Anonymous);

export const checkAuthFx = createEffect(async () => {
  // eslint-disable-next-line effector/no-getState
  const auth = $auth.getState();

  if (auth === AuthStatus.Authenticated) return auth;
  if (auth === AuthStatus.Anonymous) return auth;

  const token = await sessionLoadFx();
  return token ? AuthStatus.Authenticated : AuthStatus.Anonymous;
});

sample({
  clock: sessionLoadFx.doneData,
  target: setSecurityDataFx,
});
