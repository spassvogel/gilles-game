import { getProductionStructureForItem } from 'definitions/production';
import { ProducableItem } from 'store/types/structure';
import { getDefinition as getItemDefinition } from 'definitions/items';
import ProducedAtStructure from './ProducedAtStructure';
import { TextManager } from 'global/TextManager';

interface Props {
  item: ProducableItem;
}

const ProduceOrStudy = (props: Props) => {
  const structure = getProductionStructureForItem(props.item);
  const itemDefinition = getItemDefinition(props.item);
  if (itemDefinition.unique) {
    return (
      <p>{TextManager.get('ui-tooltip-unique-item')}</p>
    );
  }
  if (!structure) {
    return null;
  }
  return (
    <ProducedAtStructure item={props.item} structure={structure} />
  );
};


export default ProduceOrStudy;
