const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export async function fetchResource(resource: string) {
  const res = await fetch(`${API_URL}/${resource}`);
  if (!res.ok) throw new Error('Failed to fetch ' + resource);
  return res.json();
}

export async function saveResource(resource: string, data: any) {
  const res = await fetch(`${API_URL}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save ' + resource);
  return res.json();
}

export async function patchResource(resource: string, data: any) {
  const res = await fetch(`${API_URL}/${resource}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to patch ' + resource);
  return res.json();
}

export async function deleteResource(resource: string) {
  const res = await fetch(`${API_URL}/${resource}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete ' + resource);
  return res.json();
} 