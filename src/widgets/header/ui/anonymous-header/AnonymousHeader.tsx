import { NavLink } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';

export function AnonymousHeader() {
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <NavLink className="navbar-brand" to={PATH_PAGE.root}>
          conduit
        </NavLink>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <NavLink className="nav-link" to={PATH_PAGE.root}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={PATH_PAGE.login}>
              Sign in
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={PATH_PAGE.register}>
              Sign up
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
