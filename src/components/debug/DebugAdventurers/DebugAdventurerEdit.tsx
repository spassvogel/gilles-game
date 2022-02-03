import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { TextManager } from 'global/TextManager';
import { MAX_VALUE, MIN_VALUE } from 'mechanics/adventurers/attributes';
import { Attribute, attributeList } from 'store/types/adventurer';
import { addXp, modifyHealth, renameAdventurer, setBasicAttributes } from 'store/actions/adventurers';
import { xpToLevel } from 'mechanics/adventurers/levels';
import { calculateBaseHitpoints } from 'mechanics/adventurers/hitpoints';
import { useAdventurer } from 'hooks/store/adventurers';
import AdventurerXpInput from './AdventurerXpInput';
import { formatNumber } from 'utils/format/number';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import { IconSize } from 'components/ui/common/Icon';

type Props = {
  adventurerId: string;
};

const DebugAdventurers = (props: Props) => {
  const dispatch = useDispatch();
  const { adventurerId } = props;
  const adventurer = useAdventurer(adventurerId);
  const { xp, basicAttributes, health } = adventurer;
  const level = xpToLevel(xp);
  const baseHP = calculateBaseHitpoints(level, basicAttributes.for);

  const handleChangeAttribute = (attribute: Attribute, value: number) => {
    dispatch(setBasicAttributes(adventurer.id, {
      ...basicAttributes,
      [attribute]: value,
    }));
  };

  const renderAttribute = (attribute: Attribute) => {
    return (
      <Fragment key={attribute}>
        <dt>
          {TextManager.getAttributeName(attribute)}
        </dt>
        <dd>
          <div className="slider">
            <input
              type="range"
              min={MIN_VALUE}
              max={MAX_VALUE}
              value={basicAttributes[attribute]}
              onChange={(e) => handleChangeAttribute(attribute, Number(e.currentTarget.value))}
            />
            <div className="value">
              ({basicAttributes[attribute]})
            </div>
          </div>
        </dd>
      </Fragment>
    );
  };

  const handleRename = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(renameAdventurer(adventurer.id, e.currentTarget.value));
  };

  const handleChangeHealth = (value: number) => {
    dispatch(modifyHealth(adventurer.id, value));
  };

  const handleChangeXP = (value: number) => {
    dispatch(addXp(adventurer.id, value));
  };


  return (
    <div className="debug-adventurer-edit">
      <AdventurerAvatar adventurer={adventurer} size={IconSize.biggest} />
      {TextManager.getAdventurerFlavor(adventurerId, adventurer.name)}
      <fieldset>
        <summary>General</summary>
        <dl>
          <dt>Name</dt>
          <dd>
            <div className="slider">
              <input
                type="text"
                value={adventurer.name}
                onChange={handleRename}
              />
            </div>
          </dd>
          <dt>XP</dt>
          <dd>
            <div className="slider">
              <AdventurerXpInput
                xp={xp}
                onChange={handleChangeXP}
              />
              <span className="info">
                (level {xpToLevel(xp)})
              </span>
            </div>
          </dd>
          <dt>Health</dt>
          <dd>
            <div className="slider">
              <input
                type="range"
                min={0}
                max={baseHP}
                value={health}
                onChange={(e) => handleChangeHealth(Number(e.currentTarget.value) - health)}
                />
              <span className="info value">
                ({formatNumber(health, 2)}/{formatNumber(baseHP, 2)})
              </span>
            </div>
          </dd>
        </dl>
      </fieldset>
      <fieldset>
        <summary>Attributes</summary>
        <dl>
          {attributeList.map(a => renderAttribute(a))}
        </dl>
      </fieldset>
    </div>
  );
};

export default DebugAdventurers;

