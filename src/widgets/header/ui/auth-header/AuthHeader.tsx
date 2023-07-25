import { IoCreateOutline, IoSettingsSharp } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { PATH_PAGE } from '~shared/lib/react-router';

export function AuthHeader() {
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
            <NavLink className="nav-link" to={PATH_PAGE.editor.root}>
              <IoCreateOutline size={16} />
              &nbsp;New Article
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to={PATH_PAGE.settings}>
              <IoSettingsSharp size={16} />
              &nbsp;Settings
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              // @ts-ignore
              to={PATH_PAGE.profile.root(user.username)}
            >
              <img
                className="user-pic"
                // @ts-ignore
                src={user.image || ''}
                // @ts-ignore
                alt={user.username}
              />
              {/* {user.username} */}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
