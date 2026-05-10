// Simple in-memory cache with TTL
const cache = new Map<string, { data: any; expiry: number }>();

export function getCache(key: string): any | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

export function setCache(key: string, data: any, ttlSeconds: number = 60): void {
    cache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}

export function clearCache(prefix?: string): void {
    if (!prefix) {
        cache.clear();
        return;
    }
    for (const key of cache.keys()) {
        if (key.startsWith(prefix)) cache.delete(key);
    }
}
