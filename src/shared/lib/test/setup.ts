/* eslint-disable import/no-extraneous-dependencies */
import matchers from '@testing-library/jest-dom/matchers';
import { act, cleanup } from '@testing-library/react';
import { expect, afterEach, vi } from 'vitest';
import { realworldApi } from '~shared/api/realworld';
import { server } from '../../api/msw';

const storeResetFns = vi.hoisted(() => new Set<() => void>());

expect.extend(matchers);

beforeAll(() => server.listen());

beforeEach(() => {
  realworldApi.setSecurityData('jwt.token');
  act(() => storeResetFns.forEach((resetFn) => resetFn()));
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  realworldApi.setSecurityData(null);
  vi.clearAllMocks();
});

afterAll(() => server.close());
