import { attach, createEvent, sample } from 'effector';
import { z } from 'zod';
import { effectorSessionApi, effectorSessionModel } from '~entities/session';
import { abortRequestFx } from '~shared/api/realworld';
import { requestFactory } from '~shared/api/request';
import { formFactory } from '~shared/lib/form';
import { sessionModel } from '~shared/session';

const abortFx = attach({ effect: abortRequestFx });
const requestUserFx = attach({ effect: effectorSessionApi.createUserFx });

export const formSubmitted = createEvent();
export const pageUnmounted = createEvent();
export const registerRouteOpened = createEvent();

export const { sessionCheckStarted, sessionReceivedAuthenticated } =
  sessionModel.chainAuthorized();

sample({
  clock: registerRouteOpened,
  target: sessionCheckStarted,
});

// sample({
//   clock: sessionReceivedAuthenticated,
//   fn: () => '/',
//   target: redirectFx,
// });

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
  resetOn: [requestUserFx.done, registerRouteOpened],
  name: 'registerForm',
});

export const emailField = fields.email;
export const passwordField = fields.password;
export const usernameField = fields.username;

export const $formValidating = $validating;

const cancelToken = 'requestUserFx';

sample({
  clock: formSubmitted,
  source: $newUser,
  filter: $valid,
  fn: (user) => ({ user, params: { cancelToken } }),
  target: requestUserFx,
});

sample({
  clock: pageUnmounted,
  fn: () => cancelToken,
  target: abortFx,
});

export const response = requestFactory({
  effect: requestUserFx,
  reset: [formSubmitted, registerRouteOpened],
  name: 'requestUserFx',
});

sample({
  clock: requestUserFx.doneData,
  fn: (user) => user.token,
  target: effectorSessionModel.sessionCreateFx,
});
