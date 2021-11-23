import { Consumable } from "definitions/items/consumables";
import { ItemType } from "definitions/items/types";

export interface StockpileStoreState {
  "apparel": (ItemType|null)[],
  "deed": (ItemType|null)[],
  "herb": (ItemType|null)[],
  "material": (ItemType|null)[],
  "mineral": (ItemType|null)[],
  "consumable": (Consumable|null)[],
  "questItem": (ItemType|null)[],
  "trinket": (ItemType|null)[],
  "weapon": (ItemType|null)[],
}
