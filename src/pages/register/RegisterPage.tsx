// import { ChangeEvent, FormEventHandler, useEffect } from 'react';
// import { useUnit } from 'effector-react';
// import { Link } from 'react-router-dom';
// import { PATH_PAGE } from '~shared/lib/react-router';
// import { ErrorHandler } from '~shared/ui/error-handler';
// // import {
// //   $formValidating,
// //   response,
// //   emailField,
// //   formSubmitted,
// //   pageUnmounted,
// //   passwordField,
// //   usernameField,
// // } from './model';

// function UsernameField() {
//   const [value, errors] = useUnit([
//     usernameField.$value,
//     usernameField.$errors,
//   ]);
//   const [changed, touched] = useUnit([
//     usernameField.changed,
//     usernameField.touched,
//   ]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     changed(e.target.value);

//   const handleBlur = () => touched();

//   return (
//     <fieldset className="form-group">
//       <input
//         className="form-control form-control-lg"
//         type="text"
//         placeholder="Your Name"
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />
//       {errors && <p>{errors.join(', ')}</p>}
//     </fieldset>
//   );
// }

// function EmailField() {
//   const [value, errors] = useUnit([emailField.$value, emailField.$errors]);
//   const [changed, touched] = useUnit([emailField.changed, emailField.touched]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     changed(e.target.value);

//   const handleBlur = () => touched();

//   return (
//     <fieldset className="form-group">
//       <input
//         className="form-control form-control-lg"
//         type="text"
//         placeholder="Email"
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />
//       {errors && <p>{errors.join(', ')}</p>}
//     </fieldset>
//   );
// }

// function PasswordField() {
//   const [value, errors] = useUnit([
//     passwordField.$value,
//     passwordField.$errors,
//   ]);
//   const [changed, touched] = useUnit([
//     passwordField.changed,
//     passwordField.touched,
//   ]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
//     changed(e.target.value);

//   const handleBlur = () => touched();

//   return (
//     <fieldset className="form-group">
//       <input
//         className="form-control form-control-lg"
//         type="password"
//         placeholder="Password"
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//       />
//       {errors && <p>{errors.join(', ')}</p>}
//     </fieldset>
//   );
// }

// export function RegisterPage() {
//   const [pending, error] = useUnit([response.$pending, response.$error]);
//   const [validating] = useUnit([$formValidating]);
//   const [submitted, unmounted] = useUnit([formSubmitted, pageUnmounted]);

//   const onFormSubmit: FormEventHandler = (e) => {
//     e.preventDefault();
//     submitted();
//   };

//   useEffect(() => unmounted, [unmounted]);

//   return (
//     <div className="auth-page">
//       <div className="container page">
//         <div className="row">
//           <div className="col-md-6 offset-md-3 col-xs-12">
//             <h1 className="text-xs-center">Sign up</h1>
//             <p className="text-xs-center">
//               <Link to={PATH_PAGE.login}>Have an account?</Link>
//             </p>

//             {error && <ErrorHandler error={error} />}

//             <form onSubmit={onFormSubmit}>
//               <fieldset disabled={validating || pending}>
//                 <UsernameField />
//                 <EmailField />
//                 <PasswordField />
//                 <button
//                   type="submit"
//                   className="btn btn-lg btn-primary pull-xs-right"
//                 >
//                   Sign up
//                 </button>
//               </fieldset>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
export function RegisterPage() {
  return <div className="auth-page">RegisterPage</div>;
}
