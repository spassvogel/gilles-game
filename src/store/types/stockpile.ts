import { Consumable } from "definitions/items/consumables";
import { Item } from "definitions/items/types";

export interface StockpileStoreState {
  "apparel": (Item|null)[],
  "deed": (Item|null)[],
  "herb": (Item|null)[],
  "material": (Item|null)[],
  "mineral": (Item|null)[],
  "consumable": (Consumable|null)[],
  "questItem": (Item|null)[],
  "trinket": (Item|null)[],
  "weapon": (Item|null)[],
}
