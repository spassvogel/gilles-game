import { getDefinition as getWeaponDefinition, WeaponTypeDefinition, WeaponType, Weapon } from 'definitions/items/weapons';
import { TextManager } from 'global/TextManager';
import ProduceOrStudy from '../ProduceOrStudy';
import { Item } from "definitions/items/types";
import DamageList from "./DamageList";
import Effects from "../Effects";

interface Props {
  item: Item<Weapon>;
}

const WeaponContent = (props: Props) => {
  const { item } = props;
  const definition = getWeaponDefinition(item.type)

  const subtext = TextManager.getItemSubtext(item.type);
  const weaponType = TextManager.getWeaponType(definition.weaponType);
  const { classification } = WeaponTypeDefinition[definition.weaponType];
  const classificationText = TextManager.getWeaponClassification(classification);

  return (
    <>
      <div className="subheader">{weaponType}
        {definition.weaponType !== WeaponType.shield && (` (${classificationText})`)}
      </div>
      <hr />
      { definition.damage && <DamageList damage={definition.damage} /> }
      { !!(definition.effects?.length) && (
        <Effects effects={definition.effects}/>
      )}
      <hr />
      <ProduceOrStudy item={item.type} />
      { subtext && (
        <>
          <hr />
          <p className="secondary">{`"${subtext}"`}</p>
        </>
      )}
    </>
  );

}

export default WeaponContent;
