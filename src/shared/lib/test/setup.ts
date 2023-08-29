/* eslint-disable import/no-extraneous-dependencies */
import matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { expect, afterEach, vi } from 'vitest';
import { server } from '../../api/msw';

expect.extend(matchers);

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => server.close());
