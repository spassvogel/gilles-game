import Inventory from "components/ui/inventory/Inventory";
import ResourcesBox from "components/ui/resources/ResourcesBox";
import { DragSourceType } from "constants/dragging";
import AdventurerInfo from "containers/ui/AdventurerInfo";
import { Item } from "definitions/items/types";
import { getDefinition, Structure  } from "definitions/structures";
import { StructureDefinition } from "definitions/structures/types";
import usePrevious from "hooks/usePrevious";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { empty, ResourceStoreState } from "stores/resources";
import { StructuresStoreState } from "stores/structures";
import { TextManager } from "global/TextManager";
import "./css/warehousestructureview.css";
import AdventurerTabstrip from 'components/world/QuestPanel/AdventurerTabstrip';

export interface DispatchProps {
    onMoveItemInWarehouse: (fromSlot: number, toSlot: number) => void;
    onMoveItemFromAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number, otherItem: Item|null) => void;
    onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onMoveItemToAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number) => void;
    onUpgrade?: (cost: number, level: number) => void;
}

// tslint:disable-next-line: no-empty-interface
export interface Props  {
}

export interface StateProps  {
    level: number;
    workers: number;
    workersFree: number;
    gold: number;
    items: (Item|null)[];
    adventurersInTown: AdventurerStoreState[];
    structures: StructuresStoreState;
    resources: ResourceStoreState;
    maxResources: ResourceStoreState;
}

type AllProps = Props & StateProps & DispatchProps;

const WAREHOUSE = DragSourceType.warehouse;

// todo 20191202: Resource update should happen at a set interval
const WarehouseStructureView = (props: AllProps) => {

    const [selectedAdventurer, setSelectedAdventurer] = useState<string>();

    const [resourcesDelta, setResourcesDelta] = useState<ResourceStoreState>(empty);    // updating this will trigger animation
    const previousResources = usePrevious(props.resources);
    const resourcesRef = useRef<HTMLFieldSetElement>(null);

    useEffect(() => {
        // Calculate delta
        const delta = Object.keys(props.resources).reduce((acc, value) => {
            if (previousResources && previousResources[value]) {
                acc[value] = props.resources[value] - previousResources[value];
            }
            return acc;
        }, {});

        setResourcesDelta(delta);
    }, [props.resources, previousResources]);

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
    const level: number = props.level;
    const displayName = TextManager.getStructureName(Structure.warehouse);

    const createUpgradeRow = () => {
        const gold = props.gold;
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (props.onUpgrade) { props.onUpgrade(nextLevelCost, level + 1); }
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
            switch (sourceType) {
                case WAREHOUSE:
                    if (props.onMoveItemInWarehouse) {
                        props.onMoveItemInWarehouse(fromSlot, toSlot);
                    }
                    break;
                case DragSourceType.adventurerInventory:
                    if (props.onMoveItemFromAdventurer) {
                        const otherItem = props.items[toSlot];
                        props.onMoveItemFromAdventurer(sourceId!, item, fromSlot, toSlot, otherItem);
                    }
                    break;
            }
        };

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
                    resources={props.resources}
                    structures={props.structures}
                    maxResources={props.maxResources}
                    deltaResources={resourcesDelta}
                />
            </fieldset>
            <h3>Stockpile</h3>
            <Inventory
                sourceType={WAREHOUSE}
                items={props.items}
                onDropItem={handleDropItemWarehouse}
            />
            <h3>Adventurers</h3>
            <div>
                <AdventurerTabstrip
                    adventurers={props.adventurersInTown}
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
