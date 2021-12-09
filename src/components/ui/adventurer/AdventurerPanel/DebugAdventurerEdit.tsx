import { useState } from "react";
import { useDispatch } from "react-redux";
import { TextManager } from "global/TextManager";
import { MAX_VALUE, MIN_VALUE } from "mechanics/basicAttributes";
import { AdventurerStoreState, BasicAttribute } from "store/types/adventurer";
import { modifyHealth, renameAdventurer, setBasicAttributes } from "store/actions/adventurers";
import { xpToLevel } from "mechanics/adventurers/levels";
import { calculateBaseHitpoints } from "mechanics/adventurers/hitpoints";
import { DraggableInfoWindow } from "components/ui/modals/InfoWindow/DraggableInfoWindow";
import "./styles/debugAdventurerEdit.scss";

type Props = {
  adventurer: AdventurerStoreState;
}

const DebugAdventurerEdit = (props: Props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { adventurer } = props;
  const { xp, basicAttributes, health } = adventurer;
  const level = xpToLevel(xp);
  const baseHP = calculateBaseHitpoints(level, basicAttributes.for);

  const renderAttribute = (attribute: BasicAttribute) => {
    return (
      <>
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
      </>
    )
  }

  const handleRename = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(renameAdventurer(adventurer.id, e.currentTarget.value));
  };

  const handleChangeAttribute = (attribute: BasicAttribute, value: number) => {
    dispatch(setBasicAttributes(adventurer.id, {
      ...basicAttributes,
      [attribute]: value
    }));
  }

  const handleChangeHealth = (value: number) => {
    dispatch(modifyHealth(adventurer.id, value));
  }

  return (
    <span className="debug-adventurer-edit">
      {open && (
        <DraggableInfoWindow className="debug-adventurer-edit modal" title="Edit adventurer stats">
          <hr/>
          <fieldset>
            <summary>General</summary>
            <dl>
              <td>Name</td>
              <dd>
                <input
                  type="text"
                  value={adventurer.name}
                  onChange={handleRename}
                />
              </dd>
              <td>Health</td>
              <dd>
                <input
                  type="range"
                  min={0}
                  max={baseHP}
                  value={health}
                  onChange={(e) => handleChangeHealth(Number(e.currentTarget.value) - health)}
                />
                <div className="value">
                  ({health}/{baseHP})
                </div>
              </dd>
            </dl>
          </fieldset>
          <fieldset>
            <summary>Attributes</summary>
            <dl>
              {renderAttribute("str")}
              {renderAttribute("for")}
              {renderAttribute("int")}
              {renderAttribute("agi")}
            </dl>
          </fieldset>
        </DraggableInfoWindow>
      )}
      <span className="button-toggle" onClick={() => setOpen(!open)}>
        { open ? '(close)' : '(edit)' }
      </span>
    </span>
  )
}

export default DebugAdventurerEdit;


