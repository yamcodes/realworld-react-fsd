import { createEvent, createStore, sample } from 'effector';
import { UserDto, setSecurityDataFx } from '~shared/api/realworld';
import { sessionLoadFx, userGetFx } from './api';

enum AuthStatus {
  Initial = 0,
  Pending,
  Anonymous,
  Authenticated,
}

export const $authStatus = createStore(AuthStatus.Initial, {
  name: 'authStatus',
});
const $token = createStore<string | null>(null, { name: 'token' });
export const $user = createStore<UserDto | null>(null, { name: 'user' });

$authStatus.on(sessionLoadFx, (status) => {
  if (status === AuthStatus.Initial) return AuthStatus.Pending;
  return status;
});

$authStatus.on(userGetFx.doneData, () => AuthStatus.Authenticated);

$authStatus.on(
  [sessionLoadFx.fail, userGetFx.fail],
  () => AuthStatus.Anonymous,
);

$token.on(sessionLoadFx.doneData, (_, token) => token);
$user.on(userGetFx.doneData, (_, user) => user);

export function chainAuthorized() {
  const sessionCheckStarted = createEvent();
  const sessionReceivedAuthenticated = createEvent();
  const sessionReceivedAnonymous = createEvent();

  const alreadyAuthenticated = sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.Authenticated,
  });

  const alreadyAnonymous = sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.Anonymous,
  });

  sample({
    clock: sessionCheckStarted,
    source: $authStatus,
    filter: (status) => status === AuthStatus.Initial,
    target: sessionLoadFx,
  });

  sample({
    clock: [alreadyAuthenticated, sessionLoadFx.done],
    source: $token,
    target: [setSecurityDataFx, userGetFx],
  });

  sample({
    clock: [userGetFx.done],
    target: sessionReceivedAuthenticated,
  });

  sample({
    clock: [alreadyAnonymous, sessionLoadFx.fail, userGetFx.fail],
    target: sessionReceivedAnonymous,
  });

  return {
    sessionCheckStarted,
    sessionReceivedAuthenticated,
    sessionReceivedAnonymous,
  };
}
