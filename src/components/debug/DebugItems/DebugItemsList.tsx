import { IconSize } from 'components/ui/common/Icon';
import ItemIcon from 'components/ui/items/ItemIcon';
import { ItemDefinition, ItemType } from 'definitions/items/types';
import { TextManager } from 'global/TextManager';
import { entries } from 'utils/typescript';
import './styles/debugItemsList.scss';

type Props = {
  items: { [key: string]: ItemDefinition }
};


const prepareText = (definition: ItemDefinition) => {
  const asString = JSON.stringify(definition, undefined, 2).replaceAll('\n  ', '\n');
  return asString.substring(2, asString.length - 2);
};

const DebugItemsList = (props: Props) => {
  const { items } = props;
  return (
    <div className="debug-items-list">
      {entries(items).map(([key, value]) => {
        return (
          <div className="item" key={key}>
            <ItemIcon item={{ type: key as ItemType }} size={IconSize.big} />
            <div className="info">
              <h2>{TextManager.getItemName(key as ItemType)}</h2>
              { value.rarity !== undefined && <h3>{TextManager.getRarity(value.rarity)}</h3>}
              <pre>
                {prepareText(value)}
              </pre>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DebugItemsList;
