export const formatNumber = (input: number, digits = 1): string => {
  const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

  // what tier? (determines SI symbol)
  const tier = Math.log10(input) / 3 | 0;
  // if zero, we don't need a suffix
  if(tier === 0) return input.toFixed(digits);

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = input / scale;

  // format number and add suffix
  return scaled.toFixed(digits) + suffix;
}

export const roundIfNeeded = (input: number, digits = 1): number => {
  return Math.round((input + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
}
