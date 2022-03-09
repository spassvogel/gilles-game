import { Attribute, attributeList } from 'store/types/adventurer';
import { TextManager } from 'global/TextManager';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import { AttributesExtended, AttributeSourceType, ExtendedAttribute } from 'mechanics/adventurers/attributes';
import { roundIfNeeded } from 'utils/format/number';
import AttributeIndicator from 'components/ui/attributes/AttributeIndicator';
import { Fragment } from 'react';

type Props = {
  attributes: AttributesExtended;
  small?: boolean;
};

// Seperate list of attributes, intended to share the same container as SkillsListItems
const AttributeListItems = (props: Props) => {
  const { attributes, small } = props;

  const renderRow = (attribute: Attribute) => {
    const extendedAttribute: ExtendedAttribute = {
      attribute,
      components: attributes[attribute],
    };
    const handleClick = (event: React.MouseEvent) => {
      const origin = (event.currentTarget as HTMLElement);
      const originRect = origin.getBoundingClientRect();

      TooltipManager.showContextTooltip(ContextType.attribute, extendedAttribute, originRect);
      event.stopPropagation();
    };

    // Split out base and additional attribute components
    const { base, additional } = extendedAttribute.components.reduce((acc, value) => {
      if (value.origin.type === AttributeSourceType.base) {
        acc.base += value.value;
      } else {
        acc.additional += value.value;
      }
      return acc;
    }, { base: 0, additional: 0 });

    return (
      <Fragment key={attribute}>
        <div className="name">
          <span onClick={handleClick}>
            {small ? attribute : TextManager.getAttributeName(attribute)}
          </span>
        </div>
        <AttributeIndicator base={base} additional={additional} />
        <div className="value-base">
          {roundIfNeeded(base)}
        </div>
        <div className="value-additional">
          { additional > 0 && (`+${roundIfNeeded(additional)}`)}
        </div>
      </Fragment>
    );
  };


  return (
    <>
      {attributeList.map(a => renderRow(a))}
    </>
  );
};

export default AttributeListItems;
