import { useState } from 'react';
import { UserSateType } from '../context/AuthContext';
import { User, UserElement } from '../model/types';
import { useAuthContext } from './useAuthContext';

export function useLogin() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async function (email: string, password: string) {
    setIsPending(true);
    setError(null);

    try {
      // let setUser = null;
      const res = await fetch('http://localhost:3000/users');

      if (!res.ok) {
        throw Error(res.statusText);
      }

      if (!email || !password) {
        throw Error('Provide email and password');
      }

      const data: UserElement[] = await res.json();
      const user: UserElement | undefined = data.find(
        user => user.password === password && user.email === email
      );

      if (user) {
        // dispatch login action
        dispatch({ type: UserSateType.LOGIN, payload: user });
        // dispatch({ type: 'LOGIN', payload: user });
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
