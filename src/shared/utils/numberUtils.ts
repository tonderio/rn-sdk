export function toCurrency(value) {
  if (isNaN(parseFloat(value))) {
    return value;
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(value);
}
