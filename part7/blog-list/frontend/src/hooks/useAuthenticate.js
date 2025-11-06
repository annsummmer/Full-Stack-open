import { useEffect, useState } from 'react';
import loginService from '../services/login.js';

export const LOGGED_IN_USER_KEY = 'loggedInUser'; // ASK: is it ok to export

export function useAuthenticate() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(LOGGED_IN_USER_KEY);
    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON ?? '');
        setUser(user);
      } catch (error) {
        console.error('Invalid user data', error);
      }
    }
  }, []);

  const login = async (username, password, onSuccess, onError) => {
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
      onSuccess();
    } catch(error) {
      onError();
    }

    return user;
  };

  const logout = (onSuccess) => {
    window.localStorage.removeItem(LOGGED_IN_USER_KEY);
    setUser(null);
    onSuccess();
  };

  return {
    login,
    logout,
    user,
  };
}
