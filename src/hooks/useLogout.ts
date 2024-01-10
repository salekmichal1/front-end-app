import { useState } from 'react';
import { UserSateType } from '../context/AuthContext';
import { useAuthContext } from './useAuthContext';

export function useLogout() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch, state } = useAuthContext();

  const logout = async function () {
    setIsPending(true);
    setError(null);

    try {
      if (state.user) {
        dispatch({ type: UserSateType.LOGOUT, payload: null });
        localStorage.removeItem('token');
      }
    } catch (err: any) {
      console.error(err.messege);
      setError(err.messege);
      setIsPending(false);
    }
  };

  return { error, isPending, logout };
}
