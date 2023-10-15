import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import style from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPasswrod] = useState("");
  const { login, error, isPending } = useLogin();
  const handleLogin = function (e) {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleLogin} className={style["login-form"]}>
      <h2>Login</h2>
      <label>
        <span>Email:</span>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        ></input>
      </label>
      <label>
        <span>Password:</span>
        <input
          type="password"
          onChange={(e) => setPasswrod(e.target.value)}
          value={password}
          required
        ></input>
      </label>
      {!isPending && (
        <button className="btn" type="submit">
          Login
        </button>
      )}
      {isPending && (
        <button className="btn" disabled>
          Loading
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}
