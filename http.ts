/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { isAuthenticated, getToken } from 'utils/localStorage';
import { refreshToken } from './amplify';

export function jwtInterceptor() {
  axios.interceptors.request.use((request: any) => {
    // add auth header with jwt if account is logged in and request is to the api url
    const isLoggedIn = isAuthenticated();
    const isApiUrl = request.url.startsWith(process.env.REACT_APP_BASEURL);

    if (isLoggedIn && isApiUrl) {
      request.headers.Authorization = `Bearer ${getToken()}`;
    }

    return request;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        // place your reentry code
        refreshToken();
      }
      return error;
    }
  );
}
