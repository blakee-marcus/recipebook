export function getBaseUrl() {
  // Prefer env. Fallback for server and client.
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  if (typeof window !== 'undefined') return window.location.origin;
  return 'https://recipebook-green.vercel.app';
}
