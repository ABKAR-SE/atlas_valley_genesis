const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const API_URL = apiUrl;

export async function api(path, method = 'GET', body, token) {
  const res = await fetch(`${apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
