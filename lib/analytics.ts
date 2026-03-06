export function trackEvent(name: string, properties?: Record<string, string>) {
  if (typeof window !== "undefined" && (window as any).umami) {
    (window as any).umami.track(name, properties);
  }
}
