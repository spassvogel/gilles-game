import Inventory from "components/ui/inventory/Inventory";
import ResourcesBox from "components/ui/resources/ResourcesBox";
import { DragSourceType } from "constants/dragging";
import { Item } from "definitions/items/types";
import { getDefinition, Structure } from "definitions/structures";
import { StructureDefinition, WarehouseStructureLevelDefinition } from "definitions/structures/types";
import usePrevious from "hooks/usePrevious";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { empty, ResourceStoreState } from "stores/resources";
import { StructuresStoreState } from "stores/structures";
import { TextManager } from "global/TextManager";
import "./css/warehousestructureview.css";
import AdventurerTabstrip from 'components/world/QuestPanel/AdventurerTabstrip';
import useStructure from 'hooks/store/useStructure';
import useResources from 'hooks/store/useResources';
import useGold from 'hooks/store/useGold';
import useStructureActions from 'hooks/actions/useStructureActions';
import useStockpileState from 'hooks/store/useStockpileState';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { useAdventurersInTown } from 'hooks/store/adventurers';
import useItemDropActions from 'hooks/actions/useItemActions';
import AdventurerInfo from 'components/ui/AdventurerInfo';

// tslint:disable-next-line: no-empty-interface
export interface Props  {
}


const WAREHOUSE = DragSourceType.warehouse;


// todo 20191202: Resource update should happen at a set interval
const WarehouseStructureView = (props: Props) => {

    const [selectedAdventurer, setSelectedAdventurer] = useState<string>();
    const resources = useResources();
    const [resourcesDelta, setResourcesDelta] = useState<ResourceStoreState>(empty);    // updating this will trigger animation
    const previousResources = usePrevious(resources);
    const resourcesRef = useRef<HTMLFieldSetElement>(null);
    const gold = useGold();
    const stockpileState = useStockpileState();
    const structuresState = useSelector<StoreState, StructuresStoreState>(store => store.structures);
    const {startUpgradeStructure} = useStructureActions();
    const adventurersInTown = useAdventurersInTown();
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

    const structureState = useStructure(Structure.warehouse);
    const levelDefinition: WarehouseStructureLevelDefinition = structureDefinition.levels[structureState.level] as WarehouseStructureLevelDefinition;
    const level: number = structureState.level;
    const displayName = TextManager.getStructureName(Structure.warehouse);

    const createUpgradeRow = () => {
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            startUpgradeStructure(nextLevelCost, level + 1, Structure.warehouse);
        };
        return (
            <div>
                <label>level:</label>{(level + 1) + " / " + structureDefinition.levels.length}
                <button
                    style={{ float: "right" }}
                    onClick={handleClick}
                    disabled={!canUpgrade}
                >
                    {upgradeText}
                </button>
            </div>
        );
    };

    const handleDropItemWarehouse = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        dropItemWarehouse(item, fromSlot, toSlot, sourceType, sourceId);
    }

    const handleAdventurerTabSelected = (tabId: string) => {
        setSelectedAdventurer(tabId);
    };

    const renderAdventurerContent = () => {
        if (selectedAdventurer) {
            return (
                <AdventurerInfo
                    adventurerId={selectedAdventurer}
                />
            );
        }
        return null;
    };

    return (
        <details open={true} className="warehouse-structureview">
            <summary>{displayName}</summary>
            {createUpgradeRow()}
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
                    {renderAdventurerContent()}
                </div>
            </div>
        </details>
    );

};

export default WarehouseStructureView;
