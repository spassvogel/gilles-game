
import { Weapon } from 'definitions/items/weapons';
import * as time from 'utils/format/time';
import { ProductionDefinition } from './types';

const weaponsmithProduction: { [key in Weapon]?: ProductionDefinition } = {
  'weapon/aegisOfValor': {
    item: { type: 'weapon/aegisOfValor' },
    levelRequired: 3,
    cost: {
      resources: { wood: 20, iron: 5 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/arbalest': {
    item: { type: 'weapon/arbalest' },
    cost: {
      resources: { wood: 20, iron: 5 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/battleAxe': {
    item: { type: 'weapon/battleAxe' },
    cost: {
      resources: { wood: 20, iron: 5 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/berserkerShield': {
    item: { type: 'weapon/berserkerShield' },
    levelRequired: 2,
    cost: {
      resources: { wood: 20, iron: 5 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/brassKnuckles': {
    item: { type: 'weapon/brassKnuckles' },
    cost: {
      resources: { wood: 20, iron: 5 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/simpleCrossbow': {
    item: { type: 'weapon/simpleCrossbow' },
    cost: {
      resources: { wood: 20, iron: 5 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/cleaver': {
    item: { type: 'weapon/cleaver' },
    cost: {
      resources: { wood: 10, iron: 15 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/club': {
    item: { type: 'weapon/club' },
    cost: {
      resources: { wood: 30 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/dagger': {
    item: { type: 'weapon/dagger' },
    cost: {
      resources: { wood: 10, iron: 10 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/flail': {
    item: { type: 'weapon/flail' },
    cost: {
      resources: { wood: 10, iron: 10 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/goldenShield': {
    item: { type: 'weapon/goldenShield' },
    levelRequired: 2,
    cost: {
      resources: { wood: 20, iron: 5 },
      time: time.HALF_HOUR,
    },
  },
  'weapon/javelin': {
    item: { type: 'weapon/javelin' },
    cost: {
      resources: { wood: 20, iron: 10 },
      time: time.ONE_HOUR + time.HALF_HOUR,
    },
  },
  'weapon/khopesh': {
    item: { type: 'weapon/khopesh' },
    cost: {
      resources: { wood: 15, iron: 40 },
      time:  time.TWO_MINUTES,
    },
  },
  'weapon/longbow': {
    item: { type: 'weapon/longbow' },
    cost: {
      resources: { wood: 40, iron: 5 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/mace': {
    item: { type: 'weapon/mace' },
    cost: {
      resources: { wood: 15, iron: 10 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/morningStar': {
    item: { type: 'weapon/morningStar' },
    cost: {
      resources: { wood: 15, iron: 15 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/paintedBuckler': {
    item: { type: 'weapon/paintedBuckler' },
    cost: {
      resources: { wood: 20, iron: 10 },
      time: time.ONE_HOUR + time.HALF_HOUR,
    },
  },
  'weapon/poisonedDagger': {
    item: { type: 'weapon/poisonedDagger' },
    cost: {
      resources: { wood: 50, iron: 15 },
      materials: [ 'material/poisonVial' ],
      time: time.ONE_HOUR,
    },
  },
  'weapon/ravenStaff': {
    item: { type: 'weapon/ravenStaff' },
    cost: {
      resources: { wood: 15, iron: 10, food: 5 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/savageStaff': {
    item: { type: 'weapon/savageStaff' },
    cost: {
      resources: { wood: 15, iron: 10, food: 5 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/spear': {
    item: { type: 'weapon/spear' },
    cost: {
      resources: { wood: 15, iron: 15 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/steelShield': {
    item: { type: 'weapon/steelShield' },
    cost: {
      resources: { wood: 15, iron: 15 },
      time: time.ONE_HOUR,
    },
  },
  'weapon/steelSword': {
    item: { type: 'weapon/steelSword' },
    cost: {
      resources: { wood: 10, iron: 30 },
      time:  time.ONE_HOUR,
    },
  },
  'weapon/warhammer': {
    item: { type: 'weapon/warhammer' },
    cost: {
      resources: { wood: 10, iron: 30 },
      time:  time.ONE_HOUR,
    },
  },
  'weapon/woodenBulwark': {
    item: { type: 'weapon/woodenBulwark' },
    cost: {
      resources: { wood: 10, iron: 30 },
      time:  time.ONE_HOUR,
    },
  },
};
export default weaponsmithProduction;

export const getDefinition = (item: Weapon) => {
  return weaponsmithProduction[item];
};
