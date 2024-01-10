import style from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

export default function Navbar() {
  const { logout } = useLogout();
  const { state } = useAuthContext();

  return (
    <nav className={style.navbar}>
      <ul>
        <li className={style.title}>
          <NavLink to="/">Home</NavLink>
        </li>

        {!state.user && (
          <>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Signup</NavLink>
            </li>
          </>
        )}

        {state.user && (
          <>
            <li>
              <NavLink to="/userPanel">
                Hello there, {state.user.username}
              </NavLink>
            </li>
            <li>
              <NavLink to="/albums">Albums</NavLink>
            </li>
            <li>
              <NavLink to="/posts">Posts</NavLink>
            </li>
            <li>
              <button className={style['navbar-btn']} onClick={logout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
