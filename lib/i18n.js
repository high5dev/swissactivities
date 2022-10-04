export const defaultLocale = 'de_CH';
export const locales = ['en_CH', 'it_CH', 'fr_CH'];

export function formatLocaleForUrl(locale) {
  return locale.toLowerCase().replace('_', '-')
}