const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('cyberrakshak_token');
export const setAuthToken = (token) => localStorage.setItem('cyberrakshak_token', token);
export const removeAuthToken = () => localStorage.removeItem('cyberrakshak_token');

export const getStoredUser = () => {
  const u = localStorage.getItem('cyberrakshak_user');
  return u ? JSON.parse(u) : null;
};
export const setStoredUser = (user) => localStorage.setItem('cyberrakshak_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('cyberrakshak_user');

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, delete Content-Type to allow browser boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    let errorMsg = 'Request failed';
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  return res;
}

export const api = {
  // Auth
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me'),

  // Incidents
  liveClassify: (text) => apiRequest('/incidents/classify', { method: 'POST', body: JSON.stringify({ text }) }),
  reportIncident: (data) => apiRequest('/incidents', { method: 'POST', body: JSON.stringify(data) }),
  getIncidents: () => apiRequest('/incidents'),
  getIncidentById: (id) => apiRequest(`/incidents/${id}`),

  // Cases
  getCases: () => apiRequest('/cases'),
  getCaseById: (caseId) => apiRequest(`/cases/${caseId}`),
  trackCasePublic: (caseId, email) => apiRequest(`/cases/track/${caseId}${email ? `?email=${encodeURIComponent(email)}` : ''}`),
  updateCaseStatus: (caseId, data) => apiRequest(`/cases/${caseId}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  assignCase: (caseId, data) => apiRequest(`/cases/${caseId}/assign`, { method: 'PUT', body: JSON.stringify(data) }),
  addCaseNote: (caseId, note) => apiRequest(`/cases/${caseId}/notes`, { method: 'POST', body: JSON.stringify({ note }) }),

  // Evidence
  uploadEvidence: (formData) => apiRequest('/evidence/upload', { method: 'POST', body: formData }),
  verifyIntegrity: (evidenceId) => apiRequest(`/evidence/${evidenceId}/verify`),
  getEvidenceForCase: (caseId) => apiRequest(`/evidence/case/${caseId}`),

  // URL Scanner
  scanUrl: (url) => apiRequest('/url/analyze', { method: 'POST', body: JSON.stringify({ url }) }),
  getUrlHistory: () => apiRequest('/url/history'),
  getRecentUrls: () => apiRequest('/url/recent'),
  deleteUrlScan: (scanId) => apiRequest(`/url/${scanId}`, { method: 'DELETE' }),

  // Complaint Draft
  getComplaintDraft: (id) => apiRequest(`/complaints/${id}`),

  // Awareness & Tips
  getAwarenessArticles: () => apiRequest('/awareness'),
  getAwarenessArticle: (slug) => apiRequest(`/awareness/${slug}`),

  // Admin
  getAnalytics: () => apiRequest('/admin/analytics'),
  getScamPatterns: () => apiRequest('/admin/scam-patterns'),
  getAuditLogs: () => apiRequest('/admin/audit-logs'),
  getUsers: () => apiRequest('/admin/users'),
  updateUserStatus: (userId, status) => apiRequest(`/admin/users/${userId}/status?status=${status}`, { method: 'PUT' }),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', { method: 'PUT' }),

  // AI Guidance Chat
  chatWithAi: (query) => apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify({ query }) })
};
