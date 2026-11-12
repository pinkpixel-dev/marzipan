// localStorage helpers. Storage can be blocked (private windows, sandboxed previews),
// so every read and write is wrapped and the demo works fine without it.

const PREFIX = 'marzipan-bakeshop:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function loadText(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(PREFIX + key, typeof value === 'string' ? value : JSON.stringify(value))
  } catch {
    /* storage unavailable or full */
  }
}

export function remove(key: string) {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* storage unavailable */
  }
}
