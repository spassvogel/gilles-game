// export type TempEffect

// TempEffect (todo: find better name) contains a number of effects that
// are temporary active on an adventurer
import { Effect } from "definitions/effects/types";

export enum TempEffectType {
  brokenLegs,               // every step decreases health
  burning,
  soma,
}

export type BaseTempEffect = {
  type: TempEffectType;
  effects: Effect[];
  timeRemaining?: number;   // if set, the effect will wear off
  charges?: number;         // if set, amount of charges still remaining
}

export type TempEffectBrokenLegs = BaseTempEffect & {
  type: TempEffectType.brokenLegs,
  damage: number
}

export type TempEffectBurning = BaseTempEffect & {
  type: TempEffectType.burning,
  interval: number,
  damage: number
}

export type TempEffectSoma = BaseTempEffect & {
  type: TempEffectType.soma,
  factor: number
}

export type TempEffect = TempEffectBrokenLegs
 | TempEffectBurning
 | TempEffectSoma;
