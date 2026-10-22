/**
 * api.js – Shërbimi qendror për komunikim me Laravel API
 * URL-ja bazë lexohet nga variabli i mjedisit Vite.
 */

import { getToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Klasë e personalizuar për gabimet e API-së me mbështetje për fushat e validimit.
 */
export class ApiError extends Error {
  constructor(message, status = 500, errors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Ndihmës i brendshëm për thirrjet administrative me Authorization Bearer header.
 */
async function adminRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Gabim HTTP ${response.status}`;
    throw new ApiError(errorMsg, response.status, data.errors || {});
  }

  return data;
}

/**
 * Merr listën e bizneseve të publikuara nga API-ja (Publike).
 * @param {Object} params – parametra opsionalë: search, category, settlement, featured
 */
export async function fetchBusinesses(params = {}) {
  const url = new URL(`${API_BASE_URL}/v1/businesses`);

  if (params.search) url.searchParams.set('search', params.search);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.settlement) url.searchParams.set('settlement', params.settlement);
  if (params.service) url.searchParams.set('service', params.service);
  if (params.website) url.searchParams.set('website', params.website);
  if (params.schedule) url.searchParams.set('schedule', params.schedule);
  if (params.featured) url.searchParams.set('featured', '1');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Gabim HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Merr listën e kategorive nga API-ja.
 */
export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/v1/categories`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Merr listën e vendbanimeve nga API-ja.
 */
export async function fetchSettlements() {
  const response = await fetch(`${API_BASE_URL}/v1/settlements`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Merr listën e shërbimeve nga API-ja.
 */
export async function fetchServices() {
  const response = await fetch(`${API_BASE_URL}/v1/services`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Merr të dhënat e plota të një biznesi sipas ID-së ose slug-ut nga API-ja.
 * @param {string|number} idOrSlug
 */
export async function fetchBusiness(idOrSlug) {
  const response = await fetch(`${API_BASE_URL}/v1/businesses/${encodeURIComponent(idOrSlug)}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Biznesi nuk u gjet.');
    }
    throw new Error(`Gabim HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ============================================================
// ADMIN API FUNCTIONS
// ============================================================

/**
 * Merr listën e të gjitha bizneseve për administratorin (përfshirë draft dhe archived).
 * @param {Object} params - search, status, category_id, settlement_id, page, per_page
 */
export async function fetchAdminBusinesses(params = {}) {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.category_id) query.set('category_id', params.category_id);
  if (params.settlement_id) query.set('settlement_id', params.settlement_id);
  if (params.page) query.set('page', params.page);
  if (params.per_page) query.set('per_page', params.per_page);

  const qs = query.toString();
  const endpoint = `/v1/admin/businesses${qs ? `?${qs}` : ''}`;

  return adminRequest(endpoint, { method: 'GET' });
}

/**
 * Merr një biznes specifik sipas ID-së për administratorin.
 * @param {number|string} id
 */
export async function fetchAdminBusiness(id) {
  return adminRequest(`/v1/admin/businesses/${id}`, { method: 'GET' });
}

/**
 * Krijon një biznes të ri (Administrator).
 * @param {Object} data
 */
export async function createAdminBusiness(data) {
  return adminRequest('/v1/admin/businesses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Përditëson një biznes ekzistues (Administrator).
 * @param {number|string} id
 * @param {Object} data
 */
export async function updateAdminBusiness(id, data) {
  return adminRequest(`/v1/admin/businesses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Ndryshon me shpejtësi statusin e një biznesi (Administrator).
 * @param {number|string} id
 * @param {'published'|'draft'|'archived'} status
 */
export async function updateAdminBusinessStatus(id, status) {
  return adminRequest(`/v1/admin/businesses/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

/**
 * Fshin një biznes nga sistemi (Administrator).
 * @param {number|string} id
 */
export async function deleteAdminBusiness(id) {
  return adminRequest(`/v1/admin/businesses/${id}`, {
    method: 'DELETE',
  });
}
