import * as React from "react";
import Inventory from "components/ui/inventory/Inventory";
import ResourcesBox from "components/structures/warehouse/ResourcesBox";
import { DragSourceType } from "constants/dragging";
import { Item } from "definitions/items/types";
import { getDefinition, Structure } from "definitions/structures";
import { StructureDefinition, WarehouseStructureDefinition, WarehouseStructureLevelDefinition } from "definitions/structures/types";
import usePrevious from "hooks/usePrevious";
import { useEffect, useRef, useState } from "react";
import { empty, ResourceStoreState } from "store/types/resources";
import { StructuresStoreState } from "store/types/structures";
import { TextManager } from "global/TextManager";
import { TooltipManager } from 'global/TooltipManager';
import AdventurerTabstrip from 'components/world/QuestPanel/AdventurerTabstrip';
import useStructureState from 'hooks/store/useStructureState';
import { useResourcesState } from 'hooks/store/resources';
import useStockpileState from 'hooks/store/useStockpileState';
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { useAdventurersInTown } from 'hooks/store/adventurers';
import useItemDropActions from 'hooks/actions/useItemActions';
import StructureLevel from '../StructureLevel';
import AdventurerPanel from 'components/ui/adventurer/AdventurerPanel';
import UpgradeHelpModal from './UpgradeHelpModal';
import { ContextType } from 'constants/context';
import "./styles/warehouseStructureView.scss";
import { addStockpileSlots } from 'store/actions/items';

// tslint:disable-next-line: no-empty-interface
export interface Props  {
}

const WAREHOUSE = DragSourceType.warehouse;

const WarehouseStructureView = () => {

    const adventurersInTown = useAdventurersInTown();
    const [selectedAdventurer, setSelectedAdventurer] = useState<string>(adventurersInTown[0]?.id);
    const resources = useResourcesState();
    const [resourcesDelta, setResourcesDelta] = useState<ResourceStoreState>(empty);    // updating this will trigger animation
    const previousResources = usePrevious(resources);
    const resourcesRef = useRef<HTMLFieldSetElement>(null);
    const stockpileState = useStockpileState();
    const structuresState = useSelector<StoreState, StructuresStoreState>(store => store.structures);
    const {dropItemWarehouse} = useItemDropActions();

    useEffect(() => {
        // Calculate delta
        const delta = Object.keys(resources).reduce((acc, value) => {
            if (previousResources && previousResources[value]) {
                acc[value] = resources[value] - previousResources[value];
            }
            return acc;
        }, {});

        setResourcesDelta(delta);
    }, [resources, previousResources]);

    useEffect(() => {
        if (!resourcesRef.current) {
            return;
        }
        const ref = resourcesRef.current as unknown as HTMLFieldSetElement;
        ref.classList.remove("animate");
        setTimeout(() => {
            if (resourcesRef) {
                ref.classList.add("animate");
            }
        }, 200);
    }, [resourcesDelta]);

    const structureDefinition = getDefinition<WarehouseStructureDefinition>(Structure.warehouse);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${Structure.warehouse} with type StructureDefinition.`);
    }

    const structureState = useStructureState(Structure.warehouse);
    const levelDefinition: WarehouseStructureLevelDefinition = structureDefinition.levels[structureState.level] as WarehouseStructureLevelDefinition;

    const handleDropItemWarehouse = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        dropItemWarehouse(item, fromSlot, toSlot, sourceType, sourceId);
    }

    const handleAdventurerTabSelected = (tabId: string) => {
        setSelectedAdventurer(tabId);
    };

    const handleHelpClicked = (event: React.MouseEvent) => {
        const origin = (event.currentTarget as HTMLElement);
        const originRect = origin.getBoundingClientRect();
        const content = <UpgradeHelpModal level={structureState.level} />;
        TooltipManager.showContextTooltip(ContextType.component, content, originRect, "upgrade-structure-tooltip");

        event.stopPropagation();
    }

    const handleUpgradeCallbacks = (nextLevel: number) => {
        const currentLevelDefinition = structureDefinition.levels[structureState.level];
        const nextLevelDefinition = structureDefinition.levels[nextLevel];
        const slots = nextLevelDefinition.maxStockpile - currentLevelDefinition.maxStockpile;
        return [
            addStockpileSlots(slots)
        ]
    }

    return (
        <div className="warehouse-structureview">
            <StructureLevel structure={Structure.warehouse} onHelpClicked={handleHelpClicked} addUpgradeCallbacks={handleUpgradeCallbacks}/>
            <fieldset className="resources" ref={resourcesRef}>
                <legend>{TextManager.get("ui-structure-warehouse-resources")}</legend>
                <ResourcesBox
                    resources={resources}
                    structures={structuresState}
                    maxResources={levelDefinition.maxResources}
                    deltaResources={resourcesDelta}
                />
            </fieldset>
            <h3>{TextManager.get("ui-structure-warehouse-stockpile")}</h3>
            <Inventory
                sourceType={WAREHOUSE}
                className="inventory-large"
                items={stockpileState}
                onDropItem={handleDropItemWarehouse}
            />
            <h3>{TextManager.get("ui-structure-warehouse-adventurers")}</h3>
            <div>
                <AdventurerTabstrip
                    adventurers={adventurersInTown}
                    selectedAdventurerId={selectedAdventurer}
                    onAdventurerTabSelected={handleAdventurerTabSelected}
                />
                <div className="adventurer-inventory">
                    { selectedAdventurer && (
                        <AdventurerPanel
                            adventurerId={selectedAdventurer}
                            horizontalMode={true}
                            traits={false}
                            skills={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );

};

export default WarehouseStructureView;
