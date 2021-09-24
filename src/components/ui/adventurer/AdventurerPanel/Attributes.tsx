import * as React from "react";
import { BasicAttribute, BasicAttributesStoreState } from "store/types/adventurer";
import { TextManager } from "global/TextManager";
import { TooltipManager } from "global/TooltipManager";
import { ContextType } from "constants/context";
import "./styles/attributes.scss"

interface Props {
  basicAttributes: BasicAttributesStoreState;
  small?: boolean
}

const Attributes = (props: Props) => {
  const { basicAttributes, small } = props;

  const renderRow = (attribute: BasicAttribute) => {
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement);
      const originRect = origin.getBoundingClientRect();

      TooltipManager.showContextTooltip(ContextType.attribute, attribute, originRect);
      event.stopPropagation();
    }
    return (
      <li >
        <div className="attribute-name">
          <span onClick={handleClick}>
            {small ? attribute : TextManager.getAttributeName(attribute)}
          </span>
        </div>
        <div className="attribute-value">
          {basicAttributes[attribute]}
        </div>
      </li>
    );
  }

  return (
    <div className="basic-attributes">
      {/* todo: use css grid */}
      <ul className="attribute-list">
        {renderRow("str")}
        {renderRow("for")}
        {renderRow("int")}
        {renderRow("agi")}
      </ul>
    </div>
  )
}
export default Attributes;
