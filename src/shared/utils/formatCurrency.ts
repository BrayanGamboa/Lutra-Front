export const formatCurrency = (
  value: number,
  locale = 'es-CO',
  currency = 'COP',
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
