import * as React from "react";
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
        <React.Fragment key={dmgType}>
          <dt>{damage}</dt>
          <dd>{TextManager.get(`damage-type-${dmgType}`)}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

export default DamageList;
