const MAX_AGE = 60 * 60 * 24 * 365;

export function setLocaleCookie(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}