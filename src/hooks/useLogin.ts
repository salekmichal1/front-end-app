import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSateType } from '../context/AuthContext';
import { UserElement } from '../model/types';
import { useAuthContext } from './useAuthContext';

export function useLogin() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const login = async function (email: string, password: string) {
    setIsPending(true);
    setError(null);

    try {
      localStorage.removeItem('token');

      const res = await fetch('http://localhost:3000/users');

      if (!res.ok) {
        throw Error(res.statusText);
      }

      if (!email || !password) {
        throw Error('Provide email and password');
      }

      const data: UserElement[] = await res.json();

      const user: UserElement | undefined = data.find(user => {
        let returnUser: UserElement | undefined = undefined;
        if (user.password === password && user.email === email) {
          returnUser = user;
        }
        return returnUser;
      });

      if (user) {
        // dispatch login action
        localStorage.setItem('token', user.token);
        dispatch({ type: UserSateType.LOGIN, payload: user });
        navigate('/');
      } else {
        throw Error('Invalid email or password');
      }
      setError(null);
      setIsPending(false);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, login };
}
