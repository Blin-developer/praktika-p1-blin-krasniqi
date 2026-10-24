/**
 * auth.js – Shërbimi për autentikimin e përdoruesve dhe administratorëve me Laravel Sanctum API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'lipjan_auth_token';
const USER_KEY = 'lipjan_auth_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser() {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

/**
 * Kyç administratorin në panelin administrativ.
 */
export async function loginAdmin(email, password) {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Dështoi kyçja.');
    throw new Error(errorMsg);
  }

  if (data.token) {
    setToken(data.token);
  }
  if (data.user) {
    setUser(data.user);
  }

  return data;
}

/**
 * Kyç përdoruesin e thjeshtë të platformës.
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/v1/auth/user-login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Dështoi kyçja.');
    throw new Error(errorMsg);
  }

  if (data.token) {
    setToken(data.token);
  }
  if (data.user) {
    setUser(data.user);
  }

  return data;
}

/**
 * Regjistron një përdorues të ri publik.
 */
export async function registerUser(name, email, password, passwordConfirmation) {
  const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Dështoi regjistrimi.');
    throw new Error(errorMsg);
  }

  if (data.token) {
    setToken(data.token);
  }
  if (data.user) {
    setUser(data.user);
  }

  return data;
}

/**
 * Merr profilin e përdoruesit / administratorit aktual.
 */
export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) {
    throw new Error('Nuk ka token autentikimi.');
  }

  const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      removeUser();
    }
    throw new Error(`Gabim autentikimi (${response.status})`);
  }

  const data = await response.json();
  if (data.user) {
    setUser(data.user);
  }
  return data;
}

/**
 * Përditëson profilin personal (emrin dhe email-in).
 */
export async function updateUserProfile(name, email) {
  const token = getToken();
  if (!token) throw new Error('Nuk ka token autentikimi.');

  const response = await fetch(`${API_BASE_URL}/v1/auth/profile`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Dështoi përditësimi.');
    throw new Error(errorMsg);
  }

  if (data.user) {
    setUser(data.user);
  }

  return data;
}

/**
 * Ndryshon fjalëkalimin e llogarisë.
 */
export async function changeUserPassword(currentPassword, newPassword, newPasswordConfirmation) {
  const token = getToken();
  if (!token) throw new Error('Nuk ka token autentikimi.');

  const response = await fetch(`${API_BASE_URL}/v1/auth/password`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: newPasswordConfirmation,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Dështoi ndryshimi i fjalëkalimit.');
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Teston qasjen në rrugën e mbrojtur administrative (/api/v1/admin/test).
 */
export async function testAdminRoute() {
  const token = getToken();
  if (!token) {
    throw new Error('Nuk ka token autentikimi.');
  }

  const response = await fetch(`${API_BASE_URL}/v1/admin/test`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gabim qasje administrative (${response.status})`);
  }

  return response.json();
}

/**
 * Shkyç përdoruesin / administratorin dhe pastron të dhënat lokale.
 */
export async function logoutUser() {
  const token = getToken();

  try {
    if (token) {
      await fetch(`${API_BASE_URL}/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (err) {
    console.error('Gabim gjatë shkyçjes në server:', err);
  } finally {
    removeToken();
    removeUser();
  }
}

export const logoutAdmin = logoutUser;
