import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:9000/api/v1';
const PROJECT_ID = 1;

export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  // 1. Login
  const loginRes = http.post(`${BASE_URL}/auth`, JSON.stringify({
    type: 'normal',
    username: 'flavieco',
    password: '123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'token présent': (r) => r.json('auth_token') !== null,
  });

  const token = loginRes.json('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  sleep(1);

  // 2. Liste des issues
  const issuesRes = http.get(`${BASE_URL}/issues?project=${PROJECT_ID}`, { headers });
  
  check(issuesRes, {
    'liste issues status 200': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Créer une issue
  const createRes = http.post(`${BASE_URL}/issues`, JSON.stringify({
    project: PROJECT_ID,
    subject: `Issue de test ${Date.now()}`,
    description: 'Description de test',
    priority: 3,
    severity: 3,
    type: 1,
  }), { headers });

  check(createRes, {
    'création issue status 201': (r) => r.status === 201,
  });

  const issueId = createRes.json('id');
  console.log('Issue créée avec ID :', issueId);

  sleep(1);

  // 4. Supprimer l'issue
  const deleteRes = http.del(`${BASE_URL}/issues/${issueId}`, null, { headers });

  check(deleteRes, {
    'suppression issue status 204': (r) => r.status === 204,
  });

  sleep(1);
}
