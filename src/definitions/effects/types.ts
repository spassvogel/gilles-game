export enum EffectType {
  brokenLegs,               // every step
  burning,
  soma,
}

export type BaseEffect = {
  type: EffectType;
  lastTick: number;         // time of last tick
  timeRemaining?: number;   // if set, the effect will wear off
  charges?: number;         // if set, amount of charges still remaining
}

export type EffectBrokenLegs = BaseEffect & {
  type: EffectType.brokenLegs,
  damage: number
}

export type EffectBurning = BaseEffect & {
  type: EffectType.burning,
  interval: number,
  damage: number
}

export type EffectSoma = BaseEffect & {
  type: EffectType.soma,
  factor: number,   // multiply all base stats by this
}

export type Effect = EffectBrokenLegs | EffectBurning | EffectSoma;

export const initializeEffect = (input: Omit<Effect, "lastTick">): Effect => {
  return {
    ...input,
    lastTick: Date.now()
  } as unknown as Effect
}
