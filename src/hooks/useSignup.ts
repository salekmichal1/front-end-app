import { useState } from 'react';
import { UserSateType } from '../context/AuthContext';
import { UserElement } from '../model/types';
import { useAuthContext } from './useAuthContext';

export function useSignup() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const signup = async function (
    email: string,
    password: string,
    passwordConfirm: string,
    nickname: string,
    phone: string
  ) {
    setError(null);
    setIsPending(true);

    try {
      localStorage.removeItem('token');
      // finding last id, to add new one
      const res = await fetch('http://localhost:3000/users');
      const data: UserElement[] = await res.json();

      const findNewId = async function () {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return (
          Math.max.apply(
            Math,
            data.map(user => user.id)
          ) + 1
        );
      };
      const newId: number = await findNewId();

      // check if email exists
      const checkEmail = async function () {
        return data.find(user => user.email === email) ? true : false;
      };

      const generateToken = function () {
        const rand = function () {
          return Math.random().toString(36).substring(2); // remove `0.`
        };

        const token = function (): string {
          return rand() + rand() + rand() + '-' + rand() + rand() + rand(); // to make it longer
        };

        return token();
      };

      const token: string = generateToken();

      if (!(await checkEmail())) {
        if (password === passwordConfirm) {
          const user: UserElement = {
            id: newId,
            name: nickname,
            username: nickname,
            email: email,
            phone: phone,
            password: password,
            token: token,
          };
          const res = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });

          if (!res) {
            throw new Error('Signup went wrong');
          }
          localStorage.setItem('token', token);
          console.log(user);
          dispatch({ type: UserSateType.LOGIN, payload: user });
        } else {
          throw new Error('Passwords does not match');
        }
      } else {
        throw new Error('Email already exists');
      }
      setError(null);
      setIsPending(false);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
}
