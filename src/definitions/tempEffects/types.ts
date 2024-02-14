// export type TempEffect

// TempEffect (todo: find better name) contains a number of effects that
// are temporary active on an adventurer
import { type Effect } from 'definitions/effects/types'

export enum TempEffectType {
  brokenLegs, // every step decreases health
  burning,
  rage,
  soma,
}

export type BaseTempEffect = {
  type: TempEffectType
  effects: Effect[]
  timeRemaining?: number // if set, the effect will wear off
  charges?: number // if set, amount of charges still remaining
}

export type TempEffectBrokenLegs = BaseTempEffect & {
  type: TempEffectType.brokenLegs
  damage: number
}

export type TempEffectBurning = BaseTempEffect & {
  type: TempEffectType.burning
  interval: number
  damage: number
}

export type TempEffectRage = BaseTempEffect & {
  type: TempEffectType.rage
  factor: number
  charges: number
}

export type TempEffectSoma = BaseTempEffect & {
  type: TempEffectType.soma
  factor: number
}

export type TempEffect = TempEffectBrokenLegs
| TempEffectBurning
| TempEffectRage
| TempEffectSoma

export const depletesChargesOnAttack = (tmpEffect: TempEffect): tmpEffect is TempEffectRage => {
  return tmpEffect.type === TempEffectType.rage
}
