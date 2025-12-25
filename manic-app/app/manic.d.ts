declare global {
  interface Window {
    __MANIC_ROUTES__?: Record<string, () => Promise<{ default: React.ComponentType }>>;
  }
}

export {};
