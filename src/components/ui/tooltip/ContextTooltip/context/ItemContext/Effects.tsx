import { TextManager } from 'global/TextManager';
import { Apparel, getDefinition as getApparelDefinition } from 'definitions/items/apparel';
import ProduceOrStudy from './ProduceOrStudy';
import { Item } from "definitions/items/types";
import { Effect } from 'definitions/effects/types';
import getEffectDescription from '../EffectContext/getEffectDescription';

interface Props {
  effects: Effect[];
}

// Displays list of effects
const Effects = (props: Props) => {
  const { effects } = props;
  // const definition = getApparelDefinition(item.type)

  return (
    <ul>
      {effects.map((e, i) => (
        <li key={`${e.type}${i}`}>
          {getEffectDescription(e)}
        </li>
      ))}
    </ul>
  );
};

export default Effects;
