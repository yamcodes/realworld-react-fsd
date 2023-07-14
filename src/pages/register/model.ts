import { attach, createEvent, sample } from 'effector';
import { z } from 'zod';
import { effectorSessionApi } from '~entities/session';
import { requestFactory } from '~shared/api/request';
import { formFactory } from '~shared/lib/form';

const requestUserFx = attach({ effect: effectorSessionApi.createUserFx });

export const formSubmitted = createEvent();

const {
  $form: $newUser,
  $valid,
  $validating,
  fields,
} = formFactory({
  fields: {
    username: {
      initialValue: '',
      validationSchema: z.string().min(5),
      name: 'username',
    },
    email: {
      initialValue: '',
      validationSchema: z.string().min(5),
      name: 'email',
    },
    password: {
      initialValue: '',
      validationSchema: z.string().min(5),
      name: 'password',
    },
  },
  validateOn: [formSubmitted],
  resetOn: [requestUserFx.done],
  name: 'registerForm',
});

export const emailField = fields.email;
export const passwordField = fields.password;
export const usernameField = fields.username;

export const $formValidating = $validating;

sample({
  clock: formSubmitted,
  source: $newUser,
  filter: $valid,
  target: requestUserFx,
});

export const { $pending, $error } = requestFactory({
  effect: requestUserFx,
  reset: [formSubmitted],
  name: 'requestUserFx',
});
