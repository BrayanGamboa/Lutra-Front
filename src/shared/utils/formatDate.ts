export const formatDate = (
  value: string | Date,
  locale = 'es-CO',
): string =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
