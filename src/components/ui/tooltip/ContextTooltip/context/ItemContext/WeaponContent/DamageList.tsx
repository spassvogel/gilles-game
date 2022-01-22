import { Fragment } from 'react';
import { TextManager } from 'global/TextManager';
import { DamageDefinition } from 'mechanics/weapons';

interface Props {
  damage: DamageDefinition;
}

const DamageList = (props: Props) => {
  const { damage } = props;
  return (
    <dl>
      {Object.entries(damage).map(([dmgType, dmg]) => (
        <Fragment key={dmgType}>
          <dd>{TextManager.get(`damage-type-${dmgType}`)}</dd>
          <dt>{dmg}</dt>
        </Fragment>
      ))}
    </dl>
  );
};

export default DamageList;
