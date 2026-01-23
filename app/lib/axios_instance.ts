import axios from 'axios';
import { useUserStore } from '@/store/userStore';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setTokenInHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const store = useUserStore.getState();
        if (store.logout) store.logout();
      } catch (e) {
        console.log("ERROR: ", e);
      }
    }
    return Promise.reject(error);
  }
);
