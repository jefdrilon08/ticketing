import axios from 'axios';
import { 
  BASE_URL,
  TOKEN_BEARER,
  APP_USER
} from 'env';
import {buildHeaders} from '../helpers/AppHelper';

export const login = (args) => {
  return axios.post(
    `${BASE_URL}/api/login`,
    {
      username: args.username,
      password: args.password
    }
  )
}

export const createSession = (args) => {
  // Store the token
  localStorage.setItem(TOKEN_BEARER, args.token);
  localStorage.setItem(APP_USER, JSON.stringify(args.user));
}

export const destroySession = () => {
  localStorage.removeItem(TOKEN_BEARER);
  localStorage.removeItem(APP_USER);
}

export const isLoggedIn = () => {
  return getCurrentUser() != false;
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_BEARER);
}

export const getCurrentUser = () => {
  const token = getToken();

  if (token) {
    const currentUser = JSON.stringify(localStorage.getItem(APP_USER));

    return currentUser;
  } else {
    return false;
  }
}
