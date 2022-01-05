import * as React from 'react';
import { Apparel, isApparel } from 'definitions/items/apparel';
import { Deed, isDeed } from 'definitions/items/deeds';
import { Item } from 'definitions/items/types';
import { isWeapon, Weapon } from 'definitions/items/weapons';
import DeedContent from './DeedContent';
import WeaponContent from './WeaponContent';
import ApparelContent from './ApparelContent';
import { TextManager } from 'global/TextManager';
import { Consumable, isConsumable } from 'definitions/items/consumables';
import ConsumableContent from './ConsumableContent';
import { ItemSource } from 'constants/items';

export interface Props {
  item: Item;
  source?: ItemSource;
}

const ItemContext = (props: Props) => {
  const { item, source } = props;

  if (isDeed(item.type)) {
    return <DeedContent item={item as Item<Deed>} />;
  }
  if (isWeapon(item.type)) {
    return <WeaponContent item={item as Item<Weapon>} />;
  }
  if (isApparel(item.type)) {
    return <ApparelContent item={item as Item<Apparel>} />;
  }
  if (isConsumable(item.type)) {
    return <ConsumableContent item={item as Item<Consumable>} source={source} />;
  }
  const subtext = TextManager.getItemSubtext(item.type);
  return (subtext && (<p className="subtext">{`"${subtext}"`}</p>)) || null;
};
export default ItemContext;
