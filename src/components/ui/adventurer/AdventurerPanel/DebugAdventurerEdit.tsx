import { useState } from "react";
import { useDispatch } from "react-redux";
import { InfoModal } from "components/ui/modals/InfoModal";
import { TextManager } from "global/TextManager";
import { MAX_VALUE, MIN_VALUE } from "mechanics/basicAttributes";
import { AdventurerStoreState, BasicAttribute } from "store/types/adventurer";
import { modifyHealth, setBasicAttributes } from "store/actions/adventurers";
import { xpToLevel } from "mechanics/adventurers/levels";
import { calculateBaseHitpoints } from "mechanics/adventurers/hitpoints";
import "./styles/debugAdventurerEdit.scss";
import { DraggableInfoWindow } from "components/ui/modals/InfoWindow/DraggableInfoWindow";

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
        <DraggableInfoWindow className="modal" title="Edit adventurer stats">
          <hr/>
          <fieldset>
            <summary>Attributes</summary>
            <dl>
              {renderAttribute("str")}
              {renderAttribute("for")}
              {renderAttribute("int")}
              {renderAttribute("agi")}
            </dl>
          </fieldset>
          <fieldset>
            <summary>Health</summary>
            <input
              type="range"
              min={0}
              max={baseHP}
              value={health}
              onChange={(e) => handleChangeHealth(Number(e.currentTarget.value) - health)}
            />
            ({health}/{baseHP})
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


