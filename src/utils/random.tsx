import * as seedrandom from "seedrandom";

let generator: seedrandom.prng;
export function init(seed: string) {
    dirty = true;
    generator = seedrandom(seed, {state: true});
}

export function random(): number {
    if (!generator) { throw new Error("Call init() before random()"); }
    dirty = true;
    return generator();
}

export function state(): seedrandom.seedrandomStateType {
    dirty = false;
    return generator.state();
}

export let dirty = false;
