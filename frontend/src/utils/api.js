const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
};

const getToken = () => {
  return localStorage.getItem('sr-token');
};

const fetchJson = async (url, init) => {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }
  return data;
};

export const apiGetRecipes = async ({ search, tags, cuisine, limit, page, ids } = {}) => {
  const params = new URLSearchParams();

  if (search) params.set('search', search);
  if (cuisine) params.set('cuisine', cuisine);
  if (typeof limit === 'number') params.set('limit', String(limit));
  if (typeof page === 'number') params.set('page', String(page));

  if (Array.isArray(tags) && tags.length > 0) {
    params.set('tags', tags.join(','));
  }

  if (Array.isArray(ids) && ids.length > 0) {
    params.set('ids', ids.join(','));
  }

  const qs = params.toString();
  const url = `${getApiBaseUrl()}/api/recipes${qs ? `?${qs}` : ''}`;
  return fetchJson(url);
};

export const apiGetRecipeById = async (id) => {
  const url = `${getApiBaseUrl()}/api/recipes/${id}`;
  return fetchJson(url);
};

export const apiCreateInteraction = async ({ recipeId, recipeNumericId, type, weight } = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('Missing auth token');
  }

  const url = `${getApiBaseUrl()}/api/interactions`;
  return fetchJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipeId, recipeNumericId, type, weight }),
  });
};

export const apiDeleteInteraction = async ({ recipeId, recipeNumericId, type } = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('Missing auth token');
  }

  const url = `${getApiBaseUrl()}/api/interactions`;
  return fetchJson(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipeId, recipeNumericId, type }),
  });
};

export const apiGetMyInteractions = async ({ type } = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('Missing auth token');
  }

  const params = new URLSearchParams();
  if (type) params.set('type', String(type));
  const qs = params.toString();

  const url = `${getApiBaseUrl()}/api/interactions/me${qs ? `?${qs}` : ''}`;
  return fetchJson(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
