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
 * Ndihmës i brendshëm për thirrjet administrative ose të autentikuara me Authorization Bearer header.
 */
async function authRequest(endpoint, options = {}) {
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

const adminRequest = authRequest;

/**
 * Merr listën e bizneseve të publikuara nga API-ja (Publike).
 * @param {Object} params – parametra opsionalë: search, category, settlement, service, website, schedule, featured
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
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim gjatë marrjes së bizneseve: ${response.status}`);
  }

  return response.json();
}

/**
 * Merr një biznes të vetëm sipas ID-së ose slug-ut (Publike).
 * @param {number|string} idOrSlug
 */
export async function fetchBusiness(idOrSlug) {
  const response = await fetch(`${API_BASE_URL}/v1/businesses/${idOrSlug}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim gjatë marrjes së biznesit: ${response.status}`);
  }

  return response.json();
}

/**
 * Merr listën e kategorive (Publike).
 */
export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/v1/categories`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim gjatë marrjes së kategorive: ${response.status}`);
  }

  return response.json();
}

/**
 * Merr listën e vendbanimeve (Publike).
 */
export async function fetchSettlements() {
  const response = await fetch(`${API_BASE_URL}/v1/settlements`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim gjatë marrjes së vendbanimeve: ${response.status}`);
  }

  return response.json();
}

/**
 * Merr listën e shërbimeve të lehtësirave (Publike).
 */
export async function fetchServices() {
  const response = await fetch(`${API_BASE_URL}/v1/services`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim gjatë marrjes së shërbimeve: ${response.status}`);
  }

  return response.json();
}

// ==========================================
// REKLAMAT (ADVERTISEMENTS) - PUBLIKE
// ==========================================

/**
 * Merr reklamat aktive që plotësojnë kushtet kohore dhe të biznesit (Publike).
 * @param {Object} params – { position, category, limit }
 */
export async function fetchAdvertisements(params = {}) {
  const url = new URL(`${API_BASE_URL}/v1/advertisements`);
  if (params.position) url.searchParams.set('position', params.position);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.limit) url.searchParams.set('limit', String(params.limit));

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Gabim gjatë ngarkimit të reklamave: ${response.status}`);
  }

  return response.json();
}

/**
 * Regjistron një klikim real të vërtetuar në backend për një reklamë.
 * @param {number|string} adId
 */
export async function trackAdClick(adId) {
  try {
    await fetch(`${API_BASE_URL}/v1/advertisements/${adId}/click`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
  } catch {
    // Fail silently in background
  }
}

/**
 * Regjistron një shikim (impression) për një reklamë.
 * @param {number|string} adId
 */
export async function trackAdImpression(adId) {
  try {
    await fetch(`${API_BASE_URL}/v1/advertisements/${adId}/impression`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    });
  } catch {
    // Fail silently in background
  }
}

// ==========================================
// REKLAMAT - ADMINISTRATOR
// ==========================================

/**
 * Merr të gjitha reklamat për panelin administrativ.
 * @param {Object} params – { search, position, status, page, per_page }
 */
export async function fetchAdminAdvertisements(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.position) query.set('position', params.position);
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', String(params.page));
  if (params.per_page) query.set('per_page', String(params.per_page));

  const qs = query.toString();
  return adminRequest(`/v1/admin/advertisements${qs ? `?${qs}` : ''}`);
}

/**
 * Krijon një reklamë të re (Administrator).
 * @param {Object} data
 */
export async function createAdminAdvertisement(data) {
  return adminRequest('/v1/admin/advertisements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Përditëson një reklamë ekzistuese (Administrator).
 * @param {number|string} id
 * @param {Object} data
 */
export async function updateAdminAdvertisement(id, data) {
  return adminRequest(`/v1/admin/advertisements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Ndryshon aktivizimin ose statusin e reklamës (Administrator).
 * @param {number|string} id
 * @param {Object} payload – { is_active, status }
 */
export async function toggleAdminAdvertisement(id, payload) {
  return adminRequest(`/v1/admin/advertisements/${id}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

/**
 * Fshin një reklamë nga sistemi (Administrator).
 * @param {number|string} id
 */
export async function deleteAdminAdvertisement(id) {
  return adminRequest(`/v1/admin/advertisements/${id}`, {
    method: 'DELETE',
  });
}

// ==========================================
// USER FAVORITES (BIZNESET E RUAJTURA)
// ==========================================

/**
 * Merr listën e bizneseve të ruajtura nga përdoruesi i kyçur.
 */
export async function fetchUserFavorites() {
  return authRequest('/v1/user/favorites');
}

/**
 * Ndryshon gjendjen e ruajtjes (shto ose hiq) për një biznes.
 * @param {number|string} businessId
 */
export async function toggleUserFavorite(businessId) {
  return authRequest(`/v1/user/favorites/${businessId}`, {
    method: 'POST',
  });
}

/**
 * Heq një biznes nga lista e ruajtur.
 * @param {number|string} businessId
 */
export async function removeUserFavorite(businessId) {
  return authRequest(`/v1/user/favorites/${businessId}`, {
    method: 'DELETE',
  });
}

/**
 * Kontrollon statusin e një biznesi nëse është i ruajtur nga përdoruesi.
 * @param {number|string} businessId
 */
export async function checkUserFavorite(businessId) {
  return authRequest(`/v1/user/favorites/${businessId}`);
}

// ==========================================
// BIZNESET - ADMINISTRATOR
// ==========================================

/**
 * Merr listën e plotë të të gjitha bizneseve (Administrator).
 * @param {Object} params – { search, status, category, settlement, page, per_page, sort, direction }
 */
export async function fetchAdminBusinesses(params = {}) {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'all') query.set('status', params.status);
  if (params.category_id) query.set('category_id', params.category_id);
  if (params.settlement_id) query.set('settlement_id', params.settlement_id);
  if (params.page) query.set('page', String(params.page));
  if (params.per_page) query.set('per_page', String(params.per_page));
  if (params.sort_by) query.set('sort_by', params.sort_by);
  if (params.sort_order) query.set('sort_order', params.sort_order);

  const qs = query.toString();
  return adminRequest(`/v1/admin/businesses${qs ? `?${qs}` : ''}`);
}

/**
 * Merr një biznes të vetëm me të gjitha detajet (Administrator).
 * @param {number|string} id
 */
export async function fetchAdminBusiness(id) {
  return adminRequest(`/v1/admin/businesses/${id}`);
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
