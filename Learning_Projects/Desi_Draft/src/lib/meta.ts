/**
 * Canonical URLs for a client-routed site.
 *
 * The origin is never guessed: it comes from VITE_SITE_URL at build time, so a
 * canonical tag only exists once the real domain is configured. Builds without
 * it simply omit the tag (and the build script omits the sitemap), which is
 * better than publishing a canonical pointing at a domain nobody owns.
 */
export const SITE_ORIGIN = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? '').replace(
  /\/+$/,
  ''
);

export function absoluteUrl(path: string) {
  if (!SITE_ORIGIN) return '';
  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Points rel=canonical at the current route; removes it when no origin is set. */
export function setCanonical(path: string) {
  const url = absoluteUrl(path);
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!url) {
    existing?.remove();
    return;
  }
  const link = existing ?? document.createElement('link');
  link.rel = 'canonical';
  link.href = url;
  if (!existing) document.head.appendChild(link);
}
