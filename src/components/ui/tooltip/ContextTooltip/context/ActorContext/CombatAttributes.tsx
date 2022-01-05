import * as React from 'react';
import { calculateDodge, calculateInitialAP } from 'mechanics/combat';
import { AttributesStoreState } from 'store/types/adventurer';

interface Props {
  basicAttributes: AttributesStoreState;
  level: number;
}

const CombatAttributes = (props: Props) => {
  const { basicAttributes, level } = props;
  return (
    <>
      <div>
        AP each turn: {calculateInitialAP(basicAttributes, level)}
      </div>
      <div>
          Dodge: {calculateDodge(basicAttributes)}%
      </div>
    </>
  );
};

export default CombatAttributes;
