export function getDecimalFraction(decimal) {
  const decimalString = decimal.toString();
  if (decimalString.includes('.')) {
    const decimalParts = decimalString.split('.');
    const numerator = parseInt(decimalParts[0] + decimalParts[1], 10);
    const denominator = Math.pow(10, decimalParts[1].length);
    return { numerator, denominator };
  } else {
    return { numerator: decimal, denominator: 1 };
  }
}
