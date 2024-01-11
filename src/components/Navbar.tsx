import style from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { logout } = useLogout();
  const { state } = useAuthContext();
  const [isExpanded, setExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setExpanded(isExpanded => !isExpanded);
  };
  return (
    <nav className={style.navbar}>
      <ul className={style.navbar__list}>
        <li className={style.title}>
          <NavLink to="/">Home</NavLink>
        </li>
        <li className={style['navbar__mobile-control']}>
          <button
            aria-expanded={isExpanded}
            aria-controls="mobile-menu"
            className={style['hamburger-btn']}
            onClick={toggleExpanded}>
            <div className={style['hamburger-btn__elements']}>
              <div className={style['hamburger-btn__group']}>
                <div className={`${style.line} ${style['line--1']}`}></div>
                <div className={`${style.line} ${style['line line--2']}`}></div>
                <div className={`${style.line} ${style['line line--3']}`}></div>

                <div className={style['hamburger-btn__close']}>
                  <div
                    className={`${style['line-cross']} ${style['cross--1']}`}></div>
                  <div
                    className={`${style['line-cross']} ${style['cross--2']}`}></div>
                </div>
              </div>
            </div>
          </button>
        </li>
        <li
          className={`${style['navbar__menu-item']} ${
            isExpanded ? style['is-open'] : style['not-open']
          }`}>
          <ul className={`${style['navbar__list-items']}`}>
            {!state.user && (
              <>
                <li className={style['navbar-btn--mobile']}>
                  <NavLink className={style['navbar-btn']} to="/login">
                    Login
                  </NavLink>
                </li>
                <li className={style['navbar-btn--mobile']}>
                  <NavLink className={style['navbar-btn']} to="/signup">
                    Signup
                  </NavLink>
                </li>
              </>
            )}

            {state.user && (
              <>
                <li>
                  <NavLink to="/userPanel">
                    Hello, {state.user.username}
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
        </li>
      </ul>
    </nav>
  );
}
