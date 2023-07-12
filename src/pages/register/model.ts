import { attach, combine, createEvent, createStore, sample } from 'effector';
import { debug } from 'patronum';
import { effectorSessionApi } from '~entities/session';
import { NewUserDto } from '~shared/api/realworld';
import { requestFactory } from '~shared/api/request';

export const usernameChanged = createEvent<string>();
export const emailChanged = createEvent<string>();
export const passwordChanged = createEvent<string>();
export const formSubmitted = createEvent();

export const $username = createStore('');
export const $email = createStore('');
export const $password = createStore('');

$username.on(usernameChanged, (_, username) => username);
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
