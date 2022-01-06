import { calculateDodge, calculateInitialAP } from 'mechanics/combat';
import { AttributesStoreState } from 'store/types/adventurer';

interface Props {
  attributes: AttributesStoreState;
  level: number;
}

const CombatAttributes = (props: Props) => {
  const { attributes, level } = props;
  return (
    <>
      <div>
        AP each turn: {calculateInitialAP(attributes, level)}
      </div>
      <div>
        Dodge: {calculateDodge(attributes)}%
      </div>
    </>
  );
};

export default CombatAttributes;
