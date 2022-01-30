import seedrandom from 'seedrandom';
import { entries } from './typescript';

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

/**
 * Returns a weighed random key of `probabilities`
 * Provide an object with keys T and probability as a number (fraction of 1)
 * @param probabilities object with probability as values
 * @returns one of the keys of `probabilities`
 */
export const weightedRoll = <T extends number | string>(probabilities: { [key in T]: number }): T => {
  const roll = random();
  let cumulative = 0;
  const found = entries(probabilities).find(([_key, value]) => {
    cumulative += value;
    if (roll < cumulative) {
      return true;
    }
    return false;
  });
  if (!found) {
    return entries(probabilities)[0][0];
  }
  return found[0];
};

// Test weightedRoll
// const testWeighedRoll = () => {
//   const test = {
//     A: 0.2,
//     B: 0.2,
//     C: 0.6,
//   };

//   const result = {
//     A: 0,
//     B: 0,
//     C: 0,
//   };

//   const testAmount = 100000;
//   for (let i = 0; i < testAmount; i += 1) {
//     result[weightedRoll(test)] += 1;
//   }

//   entries(result).forEach(([key, value]) => {
//     console.lxg(`option: ${key} was chosen ${value / (testAmount / 100)}% (prob: ${(1 / (value / (testAmount / 100))).toFixed(3)}) of the time (abs: ${value})`);
//   });
// };

export const state = (): seedrandom.State => {
  dirty = false;
  return generator.state();
};
