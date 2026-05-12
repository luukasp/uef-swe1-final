export type ApiEnvelope<T> = {
  status: number;
  data: T;
};

export function apiBase(): string {
  const base = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
  return base;
}

function buildUrl(path: string) {
  const base = apiBase();
  if (!base) return path; // allow relative in some environments
  if (path.startsWith("/v1")) return `${base}/api${path}`; // map /v1 -> /api/v1
  return `${base}${path}`;
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(`GET ${url} failed: ${res.status} - ${text}`);
  }
  return (await res.json()) as T;
}

export async function apiPost<T, R>(path: string, body: T): Promise<R> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(`POST ${url} failed: ${res.status} - ${text}`);
  }
  return (await res.json()) as R;
}
