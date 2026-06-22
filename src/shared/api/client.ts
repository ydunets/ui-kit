// Relative `/api/...` paths are proxied to the Fastify server by Vite in dev (see vite.config.ts).
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
