import React, { useState } from "react";
import { IconSize } from 'components/ui/common/Icon';
import ItemIcon from 'components/ui/items/ItemIcon';
import { Structure } from 'definitions/structures';
import { ProducableItem, ProductionStructureStoreState } from 'store/types/structure';
import { useStructureState } from 'hooks/store/structures';
import { TextManager } from 'global/TextManager';
import CraftingDetails from './CraftingDetails';

export interface Props {
    structure: Structure;
}

const CraftingArea = (props: Props) => {
    const {structure} = props;
    const [selectedItem, setSelectedItem] = useState<ProducableItem>();

    const storeState: ProductionStructureStoreState = useStructureState(structure) as ProductionStructureStoreState;
    const handleSelectCraftingItem = (item: ProducableItem) => {
        setSelectedItem(item);
    };

    return (
        <>
            <div>craft:</div>
            <div className="crafting-area">
                <ul className="vertical-tab-bar">
                    {storeState.produces.map((item) => (
                        <li
                            key={`craft${item}`}
                            onClick={() => handleSelectCraftingItem(item)}
                            className={selectedItem === item ? "selected" : ""}
                        >
                            <ItemIcon item={item} size={IconSize.smallest} />
                            { TextManager.getItemName(item) }
                        </li>
                    ))}
                </ul>
                { selectedItem && <CraftingDetails item={selectedItem} structure={structure} /> }
            </div>
        </>
    )
};

export default CraftingArea;