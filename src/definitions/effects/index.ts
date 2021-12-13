import { EffectType } from "./types";

export type EffectDefinition = {
  harmful: boolean;
}

const all = {
  [EffectType.brokenLegs]: {
    harmful: true
  },
  [EffectType.burning]: {
    harmful: true
  }
};

export default all;
export function getDefinition(effectType: EffectType): EffectDefinition {
  return all[effectType] as unknown as EffectDefinition;
}