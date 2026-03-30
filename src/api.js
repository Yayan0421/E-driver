const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  const res = await fetch(`${API_BASE}${path}`, Object.assign({}, opts, { headers }));
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export async function signup(payload) {
  return request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
}

export async function login(payload) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getBookings() {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const email = user?.email || user?.Email || null;
    const path = email ? `/bookings?email=${encodeURIComponent(email)}` : '/bookings';
    return request(path, { method: 'GET', headers: authHeaders() });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    return [];
  }
}

export async function createBooking(payload) {
  return request('/bookings', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
}

export async function getProfile() {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const email = user?.email || user?.Email || null;
    const path = email ? `/profile?email=${encodeURIComponent(email)}` : '/profile';
    return request(path, { method: 'GET', headers: authHeaders() });
  } catch (err) {
    return request('/profile', { method: 'GET', headers: authHeaders() });
  }
}

export async function updateProfile(payload) {
  return request('/profile', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(payload) });
}

export async function getConversations() {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const email = user?.email || user?.Email || null;
    const path = email ? `/conversations?email=${encodeURIComponent(email)}` : '/conversations';
    return request(path, { method: 'GET', headers: authHeaders() });
  } catch (err) {
    console.error('Error fetching conversations:', err);
    return [];
  }
}

export async function getMessages(bookingId) {
  if (!bookingId) return [];
  return request(`/messages/${bookingId}`, { method: 'GET', headers: authHeaders() });
}

export async function sendMessage(bookingId, senderEmail, senderName, senderType, messageText) {
  return request('/messages', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      bookingId,
      senderEmail,
      senderName,
      senderType,
      messageText
    })
  });
}

export async function getRideHistory() {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const email = user?.email || user?.Email || null;
    const path = email ? `/ride-history?email=${encodeURIComponent(email)}` : '/ride-history';
    return request(path, { method: 'GET', headers: authHeaders() });
  } catch (err) {
    console.error('Error fetching ride history:', err);
    return [];
  }
}

export async function acceptBooking(bookingId) {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const driverEmail = user?.email || user?.Email || null;

    return request(`/bookings/${bookingId}/accept`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ driverEmail, status: 'accepted' })
    });
  } catch (err) {
    console.error('Error in acceptBooking:', err);
    return { error: err.message };
  }
}

export async function rejectBooking(bookingId) {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const driverEmail = user?.email || user?.Email || null;

    return request(`/bookings/${bookingId}/reject`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ driverEmail, status: 'rejected' })
    });
  } catch (err) {
    console.error('Error in rejectBooking:', err);
    return { error: err.message };
  }
}

export async function completeBooking(bookingId, fare, distance, duration, rating, paymentMethod) {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const driverEmail = user?.email || user?.Email || null;

    return request(`/bookings/${bookingId}/complete`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        driverEmail,
        fare,
        distance,
        duration,
        rating,
        paymentMethod,
        status: 'completed'
      })
    });
  } catch (err) {
    console.error('Error in completeBooking:', err);
    return { error: err.message };
  }
}

export async function cancelBooking(bookingId) {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const driverEmail = user?.email || user?.Email || null;

    return request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ driverEmail, status: 'cancelled' })
    });
  } catch (err) {
    console.error('Error in cancelBooking:', err);
    return { error: err.message };
  }
}

export async function getTransactions() {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const email = user?.email || user?.Email || null;
    const path = email ? `/transactions?email=${encodeURIComponent(email)}` : '/transactions';
    return request(path, { method: 'GET', headers: authHeaders() });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return { transactions: [], summary: { totalEarnings: 0, totalDeductions: 0, netBalance: 0, transactionCount: 0 } };
  }
}

export function saveAuth(user, token) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

export function clearAuth() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

export async function createSupportTicket(name, email, subject, category, message) {
  return request('/support-tickets', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, email, subject, category, message })
  });
}

export async function getSupportTickets() {
  try {
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    const email = user?.email || user?.Email || null;
    const path = email ? `/support-tickets?email=${encodeURIComponent(email)}` : '/support-tickets';
    return request(path, { method: 'GET', headers: authHeaders() });
  } catch (err) {
    console.error('Error fetching support tickets:', err);
    return [];
  }
}

export default { signup, login, getBookings, createBooking, getProfile, updateProfile, getConversations, getMessages, sendMessage, getRideHistory, acceptBooking, rejectBooking, completeBooking, cancelBooking, getTransactions, createSupportTicket, getSupportTickets, saveAuth, clearAuth };
