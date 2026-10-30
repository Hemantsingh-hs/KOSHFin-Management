const API_BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('koshfin_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.message || `Request failed with status ${res.status}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Properties
  properties: {
    getAll: () => request('/properties'),
    getById: (id) => request(`/properties/${id}`),
    create: (data) => request('/properties', { method: 'POST', body: data }),
    update: (id, data) => request(`/properties/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/properties/${id}`, { method: 'DELETE' }),
  },

  // Rooms
  rooms: {
    getAll: (propertyId) => request(`/rooms${propertyId ? `?propertyId=${propertyId}` : ''}`),
    create: (data) => request('/rooms', { method: 'POST', body: data }),
    update: (id, data) => request(`/rooms/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
  },

  // Tenants
  tenants: {
    getAll: () => request('/tenants'),
    create: (data) => request('/tenants', { method: 'POST', body: data }),
    update: (id, data) => request(`/tenants/${id}`, { method: 'PUT', body: data }),
    delete: (id) => request(`/tenants/${id}`, { method: 'DELETE' }),
  },

  // Transactions
  transactions: {
    getAll: (query = '') => request(`/transactions${query ? `?${query}` : ''}`),
    create: (data) => request('/transactions', { method: 'POST', body: data }),
    delete: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),
  },

  // Reminders
  reminders: {
    getAll: () => request('/reminders'),
    create: (data) => request('/reminders', { method: 'POST', body: data }),
    updateSchedule: (id, data) => request(`/reminders/${id}/schedule`, { method: 'PUT', body: data }),
    sendWhatsApp: (id) => request(`/reminders/${id}/send-whatsapp`, { method: 'POST' }),
    sendBulkWhatsApp: () => request('/reminders/send-bulk-whatsapp', { method: 'POST' }),
    markPaid: (id, method = 'UPI', details = {}) =>
      request(`/reminders/${id}/pay`, { method: 'PUT', body: { method, ...details } }),
    delete: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),
    triggerScheduler: () => request('/reminders/trigger-scheduler', { method: 'POST' }),
  },

  // Summary
  summary: {
    get: () => request('/summary'),
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
  },

  // Mess
  mess: {
    get: () => request('/mess'),
    updateMenu: (days) => request('/mess/menu', { method: 'PUT', body: { days } }),
    updateAttendance: (attendance) => request('/mess/attendance', { method: 'PUT', body: { todayAttendance: attendance } }),
  },

  // WhatsApp Bot
  whatsapp: {
    getStatus: () => request('/whatsapp/status'),
    initialize: () => request('/whatsapp/initialize', { method: 'POST' }),
    disconnect: () => request('/whatsapp/disconnect', { method: 'POST' }),
    sendTest: (phone, message) => request('/whatsapp/send-test', { method: 'POST', body: { phone, message } }),
  },

  // Auth / Profile
  auth: {
    getMe: () => request('/auth/me'),
    updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: data }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
    register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  },
};

export default api;
