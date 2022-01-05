import { Item } from 'definitions/items/types';

export interface StockpileStoreState {
  'ammunition': (Item | null)[],
  'apparel': (Item | null)[],
  'deed': (Item | null)[],
  'herb': (Item | null)[],
  'material': (Item | null)[],
  'mineral': (Item | null)[],
  'consumable': (Item | null)[],
  'questItem': (Item | null)[],
  'trinket': (Item | null)[],
  'weapon': (Item | null)[],
}
