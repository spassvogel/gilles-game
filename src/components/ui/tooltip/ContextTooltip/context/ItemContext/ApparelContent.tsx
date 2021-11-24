import * as React from "react";
import { TextManager } from 'global/TextManager';
import { Apparel, getDefinition as getApparelDefinition } from 'definitions/items/apparel';
import ProduceOrStudy from './ProduceOrStudy';
import { Item } from "definitions/items/types";

interface Props {
  item: Item<Apparel>;
}

const ApparelContent = (props: Props) => {
  const { item } = props;
  const definition = getApparelDefinition(item.type)

  const { damageReduction } = definition;
  const subtext = TextManager.getItemSubtext(item.type);
  const equipmentSlot = TextManager.getEquipmentSlot(definition.equipmentType);
  const { durability = 1 } = item;

  return (
    <>
      <div>{`${equipmentSlot}`}</div>
      { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
      { damageReduction && <p> { TextManager.get("ui-tooltip-damage-reduction", { damageReduction }) } </p> }
      { <p> { TextManager.get("ui-tooltip-durability", { durability: (durability * 100).toFixed(0) }) } </p> }
      <ProduceOrStudy item={item.type} />
    </>
  );
};

export default ApparelContent;
