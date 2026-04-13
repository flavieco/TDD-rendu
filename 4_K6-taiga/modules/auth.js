import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://192.168.1.65:9000/api/v1';

export function login(username, password) {
  const res = http.post(`${BASE_URL}/auth`, JSON.stringify({
    type: 'normal',
    username: username,
    password: password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'login status 200': (r) => r.status === 200,
    'token présent': (r) => r.json('auth_token') !== null,
  });

  return res.json('auth_token');
}

export function getHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export { BASE_URL };
