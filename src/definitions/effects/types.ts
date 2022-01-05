import { ItemType } from 'definitions/items/types';
import { TempEffectType } from 'definitions/tempEffects/types';
import { Attribute } from 'store/types/adventurer';

export enum EffectType {
  attributeIncrease,
  healthDecreaseOnMove,               // every step decreases health
  healthDecreaseOverTime,
}

export type BaseEffect = {
  type: EffectType;
  timeRemaining?: number;   // if set, the effect will wear off
  charges?: number;         // if set, amount of charges still remaining
};

export type EffectAttibuteIncrease = BaseEffect & {
  type: EffectType.attributeIncrease,
  attribute: Attribute,
  factor: number,   // multiply base attribute by this
};

export type EffectHealthDecreaseOnMove = BaseEffect & {
  type: EffectType.healthDecreaseOnMove,
  damage: number
};

export type EffectHealthDecreaseOverTime = BaseEffect & {
  type: EffectType.healthDecreaseOverTime,
  interval: number,
  damage: number
};

export type Effect = EffectAttibuteIncrease
| EffectHealthDecreaseOnMove
| EffectHealthDecreaseOverTime;


export enum EffectSourceType {
  tempEffect,
  item,
}

export type EffectSource = {
  type: EffectSourceType.tempEffect,
  tempEffectType: TempEffectType
} | {
  type: EffectSourceType.item
  itemType: ItemType
};

export type EffectWithSource = Effect & {
  source: EffectSource
};

