import React, { createContext, Dispatch, useReducer } from 'react';
import { User, UserElement } from '../model/types';

export enum UserSateType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

type AuthContextProviderProps = {
  children: React.ReactNode;
};

type UserActions = {
  type: UserSateType;
  payload: UserElement;
};

const initialSate = {
  id: 0,
  name: '',
  username: '',
  email: '',
  password: '',
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: {
      lat: '',
      lng: '',
    },
  },
  phone: '',
  website: '',
  company: {
    name: '',
    catchPhrase: '',
    bs: '',
  },
};

export const AuthContext = createContext<{
  state: UserActions;
  dispatch: Dispatch<UserActions>;
} | null>({
  state: { type: UserSateType.LOGOUT, payload: initialSate },
  dispatch: () => null,
});

// setting up auth context options
export const authReducer = function (state: UserActions, action: UserActions) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

// passing reducer properties and wraping children components
export const AuthContextProvider = function ({
  children,
}: AuthContextProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    type: UserSateType.LOGOUT,
    payload: initialSate,
  });
  console.log(state);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
