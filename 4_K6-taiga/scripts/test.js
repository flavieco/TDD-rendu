import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost/api/v1';

export default function () {
  // 1. Login
  const loginRes = http.post(`${BASE_URL}/auth`, JSON.stringify({
    type: 'normal',
    username: 'flavieco',
    password: 'VOTRE_PASSWORD',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'token présent': (r) => r.json('auth_token') !== null,
  });

  const token = loginRes.json('auth_token');
  console.log('Token récupéré :', token);

  sleep(1);
}
