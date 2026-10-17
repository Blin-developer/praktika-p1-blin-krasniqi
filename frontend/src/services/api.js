/**
 * api.js – Shërbimi qendror për komunikim me Laravel API
 * URL-ja bazë lexohet nga variabli i mjedisit Vite.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Merr listën e bizneseve të publikuara nga API-ja.
 * @param {Object} params – parametra opsionalë: search, category, settlement, featured
 */
export async function fetchBusinesses(params = {}) {
  const url = new URL(`${API_BASE_URL}/v1/businesses`);

  if (params.search) url.searchParams.set('search', params.search);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.settlement) url.searchParams.set('settlement', params.settlement);
  if (params.featured) url.searchParams.set('featured', '1');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Gabim HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Merr listën e kategorive nga API-ja.
 */
export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/v1/categories`, {
    headers: { 'Accept': 'application/json' },
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
    headers: { 'Accept': 'application/json' },
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
      'Accept': 'application/json',
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

