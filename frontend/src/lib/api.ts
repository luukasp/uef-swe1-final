export type ApiEnvelope<T> = {
  status: number;
  data: T;
};

export function apiBase(): string {
  // Backend is mounted at /v1 (user said localhost:3000/v1)
  const base = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
  return base;
}

export async function apiGet<T>(path: string): Promise<T> {
  const base = apiBase();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T, R>(path: string, body: T): Promise<R> {
  const base = apiBase();
  const url = `${base}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`POST ${path} failed: ${res.status}`);
  }
  return (await res.json()) as R;
}
