export const lerp = (n1: number,  n2: number,  alpha: number): number => {
  return n1 + alpha * (n2 - n1);
}
