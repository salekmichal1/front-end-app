import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthContext = function () {
  // reading auth context
  const context = useContext(AuthContext);

  // chcek if auth context is not out of the scope
  if (!context) {
    throw Error('useAuthContext must be inside AuthContextProvider');
  }

  return context;
};
