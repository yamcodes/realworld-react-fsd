// import { attach, createEvent, sample } from 'effector';
// import { z } from 'zod';
// import { effectorSessionApi } from '~entities/session';
// import { requestFactory } from '~shared/api/request';
// import { formFactory } from '~shared/lib/form';

// const requestLoginUserFx = attach({ effect: effectorSessionApi.loginUserFx });

// export const formSubmitted = createEvent();

// const {
//   $form: $user,
//   $valid,
//   $validating,
//   fields,
// } = formFactory({
//   fields: {
//     email: {
//       initialValue: '',
//       validationSchema: z.string().min(5),
//       name: 'email',
//     },
//     password: {
//       initialValue: '',
//       validationSchema: z.string().min(5),
//       name: 'password',
//     },
//   },
//   validateOn: [formSubmitted],
//   resetOn: [requestLoginUserFx.done],
//   name: 'loginForm',
// });

// export const emailField = fields.email;
// export const passwordField = fields.password;

// export const $formValidating = $validating;

// sample({
//   clock: formSubmitted,
//   source: $user,
//   filter: $valid,
//   target: requestLoginUserFx,
// });

// export const { $pending, $error } = requestFactory({
//   effect: requestLoginUserFx,
//   reset: [formSubmitted],
//   name: 'requestLoginUserFx',
// });
