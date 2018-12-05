import * as seedrandom from "seedrandom";

let generator: seedrandom.prng;
export function init(seed: string) {
    generator = seedrandom(seed);
}

export function random(): number {
    if (!generator) { throw new Error("Call init() before random()"); }
    return generator();
}
