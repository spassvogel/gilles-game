import React from 'react';
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { useAdventurerDamageReduction } from 'hooks/store/adventurers';
import './styles/guy.scss';

export interface Props {
  adventurerId: string
}

// A silhouette of a person with the Damage Reduction numbers
const Guy = (props: Props) => {
  const { adventurerId } = props;

  const damageReduction = useAdventurerDamageReduction(adventurerId);
  const renderDamageReduction = (equipmentType: EquipmentSlotType) => {
    const dR = damageReduction[EquipmentSlotType[equipmentType]];
    if (!dR) {
      return null;
    }
    return (
      <div className={EquipmentSlotType[equipmentType]} key={equipmentType}>
        {dR}
      </div>
    );
  };

  return (
    <li className="guy">
      {(renderDamageReduction(EquipmentSlotType.head))}
      {(renderDamageReduction(EquipmentSlotType.chest))}
      {(renderDamageReduction(EquipmentSlotType.hands))}
      {(renderDamageReduction(EquipmentSlotType.shoulders))}
      {(renderDamageReduction(EquipmentSlotType.legs))}
      {(renderDamageReduction(EquipmentSlotType.feet))}
    </li>
  );
};

export default Guy;
