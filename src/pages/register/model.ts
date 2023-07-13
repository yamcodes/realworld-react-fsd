import { attach, combine, createEvent, sample } from 'effector';
import { every } from 'patronum';
import { z } from 'zod';
import { effectorSessionApi } from '~entities/session';
import { NewUserDto } from '~shared/api/realworld';
import { requestFactory } from '~shared/api/request';
// eslint-disable-next-line no-restricted-imports
import { fieldFactory } from '~shared/lib/form/model';

export const formSubmitted = createEvent();

export const usernameField = fieldFactory({
  initialValue: '',
  validateOn: [formSubmitted],
  validationSchema: z.string().min(5),
  name: 'usernameField',
});

export const emailField = fieldFactory({
  initialValue: '',
  validateOn: [formSubmitted],
  validationSchema: z.string().min(5),
  name: 'emailField',
});

export const passwordField = fieldFactory({
  initialValue: '',
  validateOn: [formSubmitted],
  validationSchema: z.string().min(5),
  name: 'passwordField',
});

const $newUser = combine<NewUserDto>({
  username: usernameField.$value,
  email: emailField.$value,
  password: passwordField.$value,
});

export const $formValidating = every({
  stores: [
    usernameField.$validating,
    emailField.$validating,
    passwordField.$validating,
  ],
  predicate: true,
});

const $formValid = every({
  stores: [usernameField.$valid, emailField.$valid, passwordField.$valid],
  predicate: true,
});

const requestUserFx = attach({
  effect: effectorSessionApi.createUserFx,
  source: $newUser,
  name: 'requestUserFx',
});

sample({
  clock: formSubmitted,
  filter: $formValid,
  target: requestUserFx,
});

export const [$user, $pending, $error] = requestFactory({
  effect: requestUserFx,
  reset: [formSubmitted],
  name: 'requestUserFx',
});
