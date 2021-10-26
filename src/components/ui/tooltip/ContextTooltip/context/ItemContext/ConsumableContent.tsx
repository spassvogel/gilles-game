import * as React from "react";
import { TextManager } from 'global/TextManager';
import { Consumable } from "definitions/items/consumables";
import { ItemSource } from "constants/items";


interface Props {
  item: Consumable;
  source?: ItemSource;
}

const ConsumableContent = (props: Props) => {
  const { item } = props;
  const subtext = TextManager.getItemSubtext(item);

  return (
    <div>
      { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
    </div>
  );

}

export default ConsumableContent;
