class SessionStore {
  private readonly store: Storage | null;

  constructor() {
    this.store =
      typeof globalThis.sessionStorage === "undefined"
        ? null
        : globalThis.sessionStorage;
  }

  get<T>(key: string): T | null {
    const value = this.store?.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  set<T>(key: string, value: T): void {
    this.store?.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.store?.removeItem(key);
  }

  clear(): void {
    this.store?.clear();
  }
}

export const sessionStore = new SessionStore();
