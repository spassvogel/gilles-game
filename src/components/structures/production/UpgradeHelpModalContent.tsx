import { Structure } from 'definitions/structures';
import { ProductionStructureDefinition } from 'definitions/structures/types';
import { IconSize } from 'components/ui/common/Icon';
import ItemIcon from 'components/ui/items/ItemIcon';
import { ItemType } from 'definitions/items/types';
import { useStructureDefinition } from 'hooks/store/structures';
import { TextManager } from 'global/TextManager';
import './styles/upgradeHelpModalContent.scss';

export interface Props  {
  structure: Structure;
  level: number;
}

const UpgradeHelpModalContent = (props: Props) => {
  const { level, structure } = props;
  const structureDefinition = useStructureDefinition<ProductionStructureDefinition>(structure);
  const nextLevel = structureDefinition.levels[level + 1];

  const renderRow = (type: ItemType) => {
    return (
      <ItemIcon key={type} item={{ type }} size={IconSize.small} />
    );
  };

  return (
    <div className="upgrade-help-model-content-production">
      <h3>{TextManager.get('ui-structure-help-upgrade-unlocks-crafting')}</h3>
      <div className="unlocks">
        {nextLevel.unlocks.map(item => renderRow(item))}
      </div>
    </div>
  );
};

export default UpgradeHelpModalContent;
