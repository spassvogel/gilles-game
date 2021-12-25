import { Effect } from 'definitions/effects/types';
import getEffectDescription from '../TempEffectContext/getEffectDescription';

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
