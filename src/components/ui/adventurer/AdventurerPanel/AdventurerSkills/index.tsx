import React, { Fragment } from 'react';
import { useAdventurer } from 'hooks/store/adventurers';
import { TextManager } from 'global/TextManager';
import { ContextType } from 'constants/context';
import { TooltipManager } from 'global/TooltipManager';
import { WeaponType } from 'definitions/weaponTypes/types';
import './styles/adventurerSkills.scss';

interface Props {
  adventurerId: string;
}

const AdventurerSkills = (props: Props) => {
  const adventurer = useAdventurer(props.adventurerId);

  const renderSkill = (skill: WeaponType) => {
    // const traitDefinition = getDefinition(trait);
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement);
      const originRect = origin.getBoundingClientRect();
      TooltipManager.showContextTooltip(ContextType.skill, skill, originRect);
      event.stopPropagation();
    };
    return (
      <Fragment key={skill}>
        <li onClick={handleClick}>
          <span className="skill" onClick={handleClick}>
            {TextManager.getSkillName(skill)}
          </span>
          <span>
            {adventurer.skills[skill]}
          </span>
          {/* {TextManager.getTraitName(trait)} */}
        </li>
      </Fragment>
    );
  };

  if (!adventurer?.skills) {
    return null;
  }
  return (
    <>
      <p>{TextManager.get('ui-adventurer-info-skills-title')}</p>
      <ul className="adventurer-skills">
        {Object.keys(adventurer.skills)?.map((s) => {
          const skill: WeaponType = s as WeaponType;
          return renderSkill(skill);
        })}
      </ul>
    </>
  );
};

export default AdventurerSkills;
