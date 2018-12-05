import * as seedrandom from "seedrandom";

let generator: seedrandom.prng;
export function init(seed: string) {
    generator = seedrandom(seed, {state: true});
}

export function random(): number {
    if (!generator) { throw new Error("Call init() before random()"); }
    return generator();
}

export function state(): seedrandom.seedrandomStateType {
    return generator.state();
}