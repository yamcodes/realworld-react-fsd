import { createEffect } from 'effector';

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
    await wait(4000);

    if (!source) return null;

    return JSON.parse(source);
  },
});

export const sessionDeleteFx = createEffect({
  name: 'sessionDeleteFx',
  handler: async () => {
    localStorage.removeItem(LocalStorageKey);
    await wait(4000);
  },
});

export const sessionCreateFx = createEffect<string, string>({
  name: 'sessionCreateFx',
  handler: async (string) => {
    localStorage.setItem(LocalStorageKey, JSON.stringify(string));
    return string;
  },
});
