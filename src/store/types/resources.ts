import { Resource } from 'definitions/resources';

// The keys should be the same as the enum Resource
export interface ResourceStoreState {
  [Resource.wood]?: number;
  [Resource.iron]?: number;
  [Resource.stone]?: number;
  [Resource.leather]?: number;
  [Resource.fabric]?: number;
  [Resource.food]?: number;
}

export const empty: ResourceStoreState = {
  fabric: 0,
  food: 0,
  iron: 0,
  leather: 0,
  stone: 0,
  wood: 0,
};
