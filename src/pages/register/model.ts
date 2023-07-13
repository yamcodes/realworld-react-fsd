import { attach, combine, createEvent, createStore, sample } from 'effector';
import { debug } from 'patronum';
import { z } from 'zod';
import { effectorSessionApi } from '~entities/session';
import { NewUserDto } from '~shared/api/realworld';
import { requestFactory } from '~shared/api/request';
// eslint-disable-next-line no-restricted-imports
import { fieldFactory } from '~shared/lib/form/model';

export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const [
  $username,
  $usernameError,
  $usernameTouch,
  $usernameValidate,
  usernameChanged,
  usernameTouched,
] = fieldFactory({
  formSubmitted,
  validationSchema: z.string().min(5),
});

export const $email = createStore('');
export const $password = createStore('');

$email.on(emailChanged, (_, email) => email);
$password.on(passwordChanged, (_, password) => password);

export const $newUser = combine<NewUserDto>({
  username: $username,
  email: $email,
  password: $password,
});

const requestUserFx = attach({
  source: $newUser,
  effect: effectorSessionApi.createUserFx,
  name: 'requestUserFx',
});

export const [$user, $pending, $error] = requestFactory({
  effect: requestUserFx,
  reset: [formSubmitted],
  name: 'requestUserFx',
});

sample({
  clock: formSubmitted,
  target: requestUserFx,
});

debug({ trace: true }, $user, $pending, $error);
