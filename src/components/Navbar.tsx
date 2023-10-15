import style from "./Navbar.module.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className={style.navbar}>
      <ul>
        <li className={style.title}>
          <Link to="/">Bankist App</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          <button className={style["navbar-btn"]} /*onClick={logout} */>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
