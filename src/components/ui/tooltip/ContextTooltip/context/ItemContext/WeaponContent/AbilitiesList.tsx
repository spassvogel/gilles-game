import { Fragment } from 'react';
import { getDefinition } from 'definitions/weaponTypes';
import { WeaponType } from 'definitions/weaponTypes/types';
import { TextManager } from 'global/TextManager';
import { getDefinition as getAbilityDefinition } from 'definitions/abilities/index';

type Props = {
  weaponType: WeaponType;
};

const AbilitiesList = (props: Props) => {
  const { weaponType } = props;
  const { abilities } = getDefinition(weaponType);
  return (
    <ul className="abilities-list">
      {abilities.map((ability) => {
        const definition = getAbilityDefinition(ability);
        return (
          <li key={ability}>
            {TextManager.getAbilityName(ability)}
            {' '}
            <span className="passive">
              {!!definition.passive && '(passive)'}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default AbilitiesList;
