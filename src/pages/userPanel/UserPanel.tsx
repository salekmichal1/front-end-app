import { useAuthContext } from '../../hooks/useAuthContext';
import style from './User.module.css';

export default function UserPanel() {
  const { state } = useAuthContext();
  return (
    <div className={style['user-data']}>
      <h2>User data:</h2>
      <p>Name: {state.user?.name}</p>
      <p>Nickname: {state.user?.username}</p>
      <p>Email: {state.user?.email}</p>
      <p>Phone number: {state.user?.phone}</p>
    </div>
  );
}
