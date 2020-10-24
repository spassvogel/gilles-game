import Inventory from "components/ui/inventory/Inventory";
import ResourcesBox from "components/ui/resources/ResourcesBox";
import { DragSourceType } from "constants/dragging";
import { Item } from "definitions/items/types";
import { getDefinition, Structure } from "definitions/structures";
import * as React from "react";
import { StructureDefinition, WarehouseStructureLevelDefinition } from "definitions/structures/types";
import usePrevious from "hooks/usePrevious";
import { useEffect, useRef, useState } from "react";
import { empty, ResourceStoreState } from "store/types/resources";
import { StructuresStoreState } from "store/types/structures";
import { TextManager } from "global/TextManager";
import AdventurerTabstrip from 'components/world/QuestPanel/AdventurerTabstrip';
import useStructureState from 'hooks/store/useStructureState';
import { useResourcesState } from 'hooks/store/resources';
import useStockpileState from 'hooks/store/useStockpileState';
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { useAdventurersInTown } from 'hooks/store/adventurers';
import useItemDropActions from 'hooks/actions/useItemActions';
import UpgradeStructureButton from '../UpgradeStructureButton';
import "./styles/warehouseStructureView.scss";
import AdventurerPanel from 'components/ui/adventurer/AdventurerPanel';

// tslint:disable-next-line: no-empty-interface
export interface Props  {
}

const WAREHOUSE = DragSourceType.warehouse;

// todo 20191202: Resource update should happen at a set interval
const WarehouseStructureView = (props: Props) => {

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

    const structureDefinition = getDefinition<StructureDefinition>(Structure.warehouse);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${Structure.warehouse} with type StructureDefinition.`);
    }

    const structureState = useStructureState(Structure.warehouse);
    const levelDefinition: WarehouseStructureLevelDefinition = structureDefinition.levels[structureState.level] as WarehouseStructureLevelDefinition;
    const displayName = TextManager.getStructureName(Structure.warehouse);

    const handleDropItemWarehouse = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        dropItemWarehouse(item, fromSlot, toSlot, sourceType, sourceId);
    }

    const handleAdventurerTabSelected = (tabId: string) => {
        setSelectedAdventurer(tabId);
    };

    return (
        <details open={true} className="warehouse-structureview">
            <summary>{displayName}</summary>
            <UpgradeStructureButton structure={Structure.warehouse} />
            <fieldset className="resources" ref={resourcesRef}>
                <legend>Resources</legend>
                <ResourcesBox
                    resources={resources}
                    structures={structuresState}
                    maxResources={levelDefinition.maxResources}
                    deltaResources={resourcesDelta}
                />
            </fieldset>
            <h3>Stockpile</h3>
            <Inventory
                sourceType={WAREHOUSE}
                className="inventory-large"
                items={stockpileState}
                onDropItem={handleDropItemWarehouse}
            />
            <h3>Adventurers</h3>
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
        </details>
    );

};

export default WarehouseStructureView;
