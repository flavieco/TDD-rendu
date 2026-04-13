import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL } from './auth.js';

const PROJECT_ID = 1;

export function listIssues(headers) {
  const res = http.get(`${BASE_URL}/issues?project=${PROJECT_ID}`, { headers });

  check(res, {
    'liste issues status 200': (r) => r.status === 200,
  });

  return res.json();
}

export function createIssue(headers, subject, description, priority, severity, type) {
  const res = http.post(`${BASE_URL}/issues`, JSON.stringify({
    project: PROJECT_ID,
    subject: subject,
    description: description,
    priority: priority,
    severity: severity,
    type: type,
  }), { headers });

  check(res, {
    'création issue status 201': (r) => r.status === 201,
  });

  return res.json('id');
}

export function updateIssue(headers, issueId) {
  // 1. Récupérer la version actuelle de l'issue
  const getRes = http.get(`${BASE_URL}/issues/${issueId}`, { headers });
  
  check(getRes, {
    'get issue status 200': (r) => r.status === 200,
  });

  const version = getRes.json('version');

  // 2. Mettre à jour avec la version
  const res = http.patch(`${BASE_URL}/issues/${issueId}`, JSON.stringify({
    status: 2,
    version: version,
  }), { headers });

  check(res, {
    'mise à jour issue status 200': (r) => r.status === 200,
  });
}

export function searchIssue(headers, subject) {
  const res = http.get(`${BASE_URL}/issues?project=${PROJECT_ID}&q=${subject}`, { headers });

  check(res, {
    'recherche issue status 200': (r) => r.status === 200,
  });

  return res.json();
}

export function deleteIssue(headers, issueId) {
  const res = http.del(`${BASE_URL}/issues/${issueId}`, null, { headers });

  check(res, {
    'suppression issue status 204': (r) => r.status === 204,
  });
}
