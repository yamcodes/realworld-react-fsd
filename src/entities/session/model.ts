import { createEvent, sample, createEffect, createStore } from 'effector';
import { setSecurityDataFx } from '~shared/api/realworld';

function wait<T>(ms: number, value?: T) {
  return new Promise<T>((resolve) => {
    setTimeout(resolve, ms, value);
  });
}

const LocalStorageKey = 'testsession';

export const sessionLoadFx = createEffect<void, string | null>({
  name: 'sessionLoadFx',
  handler: async () => {
    const source = localStorage.getItem(LocalStorageKey);
    await wait(1500);

    if (!source) return null;

    return JSON.parse(source);
  },
});

export const sessionDeleteFx = createEffect({
  name: 'sessionDeleteFx',
  handler: async () => {
    localStorage.removeItem(LocalStorageKey);
    await wait(1500);
  },
});

export const sessionCreateFx = createEffect<string, string>({
  name: 'sessionCreateFx',
  handler: async (string) => {
    localStorage.setItem(LocalStorageKey, JSON.stringify(string));
    return string;
  },
});

export const appInitialized = createEvent();

export const $token = createStore<string | null>(null, { name: 'token' });
export const $pending = createStore<boolean>(false, { name: 'pending' });
export const $error = createStore<Error | null>(null, { name: 'error' });
export const $isAuthorized = $token.map(Boolean);

sample({
  clock: appInitialized,
  target: sessionLoadFx,
});

$pending.on(sessionLoadFx.pending, (_, pending) => pending);

sample({
  clock: [sessionLoadFx.doneData],
  target: [setSecurityDataFx, $token],
});

sample({
  clock: [sessionLoadFx.failData],
  target: [$error],
});

// sample({
//   clock: sessionLoadFx.doneData,
//   filter: (data) => Boolean(data),
//   target: getUserFx,
// });

// $pending.on(getUserFx.pending, (_, pending) => pending);
// $user.on(getUserFx.doneData, (_, user) => user);
// $error.on(getUserFx.failData, (_, error) => error);

/**
 * 1. check localstorage
 * 2. localstorage has user
 * 4. setSecurityData(token)
 * 4. getCurrentUser - secure with token
 * 5. (re)write to localstorage
 */

/**
 * 1. check localstorage
 * 2. user === false
 * 4. setSecurityData(null)
 */
