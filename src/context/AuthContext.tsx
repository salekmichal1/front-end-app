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

type InitialState = {
  user: UserElement | null;
};

const initialState: InitialState = {
  user: null,
};

export const AuthContext = createContext<{
  state: InitialState;
  dispatch: Dispatch<UserActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

// setting up auth context options
export const authReducer = function (state: InitialState, action: UserActions) {
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
  const [state, dispatch] = useReducer(authReducer, initialState);
  console.log(state);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
