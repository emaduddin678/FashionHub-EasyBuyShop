const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002"

export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { query?: Record<string, string | number | boolean | undefined> },
): Promise<T> {
  const { query, ...fetchOptions } = options ?? {}

  let url = `${BASE_URL}${path}`
  if (query) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== "") params.set(k, String(v))
    }
    const qs = params.toString()
    if (qs) url += `?${qs}`
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers: { "Content-Type": "application/json", ...fetchOptions?.headers },
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }

  return res.json() as Promise<T>
}
