import seedrandom from 'seedrandom';

interface Prng {
  (): number;
  state(): seedrandom.State;
}
let generator: Prng;
export let dirty = false;

export const init = (seed: string): void => {
  dirty = true;
  generator = seedrandom(seed, { state: true });
};

export function random(): number {
  if (!generator) { throw new Error('Call init() before random()'); }
  dirty = true;
  return generator();
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 */
export const randomInt = (min = 0, max = 10): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(random() * (max - min + 1)) + min;
};

export const roll3D6 = (): number =>  {
  return randomInt(1, 6) + randomInt(1, 6) + randomInt(1, 6);
};

export const state = (): seedrandom.State => {
  dirty = false;
  return generator.state();
};
