import * as React from "react";
import { TextManager } from 'global/TextManager';
import { Apparel, getDefinition as getApparelDefinition } from 'definitions/items/apparel';
import ProduceOrStudy from './ProduceOrStudy';

interface Props {
  item: Apparel;
}

const ApparelContent = (props: Props) => {
  const { item } = props;
  const definition = getApparelDefinition(item)

  const { damageReduction } = definition;
  const subtext = TextManager.getItemSubtext(item);
  const equipmentSlot = TextManager.getEquipmentSlot(definition.equipmentType);
  return (
    <>
      <div>{`${equipmentSlot}`}</div>
      { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
      { damageReduction && <p> { TextManager.get("ui-tooltip-damage-reduction", { damageReduction}) } </p> }
      <ProduceOrStudy item={item} />
    </>
  );
};

export default ApparelContent;