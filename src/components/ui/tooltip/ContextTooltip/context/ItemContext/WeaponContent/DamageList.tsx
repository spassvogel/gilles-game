import { Fragment } from "react";
import { DamageDefinition } from "definitions/items/weapons";
import { TextManager } from "global/TextManager";

interface Props {
  damage: DamageDefinition;
}

const DamageList = (props: Props) => {
  const { damage } = props;
  return (
    <dl>
      {Object.entries(damage).map(([dmgType, damage]) => (
        <Fragment key={dmgType}>
          <dd>{TextManager.get(`damage-type-${dmgType}`)}</dd>
          <dt>{damage}</dt>
        </Fragment>
      ))}
    </dl>
  )
}

export default DamageList;
