import axios from 'axios';

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
