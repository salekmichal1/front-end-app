import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';
import style from './Signup.module.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPasswrod] = useState('');
  const [passwordConfirm, setPasswrodConfirm] = useState('');
  const [nickname, setNick] = useState('');
  const [phone, setPhone] = useState('');
  const { signup, error, isPending } = useSignup();

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signup(email, password, passwordConfirm, nickname, phone);
  };

  return (
    <form className={style['signup-form']} onSubmit={handleSubmit}>
      <h2>Create account</h2>
      <label>
        <span>Nickname: </span>
        <input
          type="text"
          onChange={e => setNick(e.target.value)}
          value={nickname}
          required></input>
      </label>
      <label>
        <span>Email: </span>
        <input
          type="email"
          onChange={e => setEmail(e.target.value)}
          value={email}
          required></input>
      </label>
      <label>
        <span>Phone: </span>
        <input
          type="text"
          onChange={e => setPhone(e.target.value)}
          value={phone}
          required></input>
      </label>
      <label>
        <span>Password: </span>
        <input
          type="password"
          onChange={e => setPasswrod(e.target.value)}
          value={password}
          required></input>
      </label>
      <label>
        <span>Confirm password: </span>
        <input
          type="password"
          onChange={e => setPasswrodConfirm(e.target.value)}
          value={passwordConfirm}
          required></input>
      </label>
      {!isPending && (
        <button className="btn" type="submit">
          Create
        </button>
      )}
      {isPending && (
        <button className="btn" disabled>
          Loading
        </button>
      )}
      {error && <p>{error.toString()}</p>}
    </form>
  );
}
