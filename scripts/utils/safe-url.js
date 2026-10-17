// Hosts that authored content may embed (iframes, media) outside our own origin.
const ALLOWED_HOSTS = new Set([
  'www.youtube-nocookie.com',
]);

/**
 * Returns a safe absolute URL, or null when the link must not be used.
 * Same-origin URLs are always allowed. Other origins need https and either
 * `external: 'any'` (plain links) or `external: 'allowlist'` plus a host in ALLOWED_HOSTS
 * (embeds). `schemes` opts in to extra schemes such as mailto: and tel:.
 * @param {string} raw URL from authored content or a query parameter
 * @param {{ external?: 'none'|'allowlist'|'any', schemes?: string[] }} [opts]
 * @returns {string|null}
 */
export default function safeUrl(raw, { external = 'none', schemes = [] } = {}) {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  // control characters and backslashes are how URL parsers get tricked
  // eslint-disable-next-line no-control-regex
  if (!value || /[\u0000-\u001F\u007F\\]/.test(value)) return null;

  let url;
  try {
    url = new URL(value, window.location.href);
  } catch {
    return null;
  }

  if (schemes.includes(url.protocol)) return url.href;
  if (url.username || url.password) return null;
  if (url.origin === window.location.origin) return url.href;

  if (url.protocol !== 'https:') return null;
  if (external === 'any') return url.href;
  if (external === 'allowlist' && ALLOWED_HOSTS.has(url.hostname)) return url.href;
  return null;
}
