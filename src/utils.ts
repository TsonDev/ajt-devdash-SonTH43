export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>): void => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = undefined;
    }, delayMs);
  };
}

export class AsyncCache<K extends string, V> {
  #cache = new Map<K, V>();
  #fetchFn: (key: K) => Promise<V>;

  constructor(fetchFn: (key: K) => Promise<V>) {
    this.#fetchFn = fetchFn;
  }

  async get(key: K): Promise<V> {
    const cached = this.#cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await this.#fetchFn(key);
    this.#cache.set(key, value);
    return value;
  }

  has(key: K): boolean {
    return this.#cache.has(key);
  }

  clear(): void {
    this.#cache.clear();
  }
}
