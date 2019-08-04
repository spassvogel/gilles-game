import AdventurerAvatar from "components/ui/AdventurerAvatar";
import Inventory from "components/ui/inventory/Inventory";
import ResourcesBox from "components/ui/resources/ResourcesBox";
import Tab from "components/widgets/Tab";
import Tabstrip from "components/widgets/Tabstrip";
import { DragSourceType } from "constants/dragging";
import { Item } from "definitions/items/types";
import { getDefinition, Structure  } from "definitions/structures";
import { StructureDefinition } from "definitions/structures/types";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { ResourceStoreState } from "stores/resources";
import { TextManager } from "utils/textManager";
import "./css/warehousestructureview.css";

export interface DispatchProps {
    onMoveItemInWarehouse: (fromSlot: number, toSlot: number) => void;
    onMoveItemFromAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number) => void;
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
    items: Array<Item|null>;
    adventurersInTown: AdventurerStoreState[];
    resources: ResourceStoreState;
    maxResources: ResourceStoreState;
}

type AllProps = Props & StateProps & DispatchProps;

interface LocalState {
    selectedAdventurer: string | null;
}

const warehouse = DragSourceType.warehouse;

class WarehouseStructureView extends React.Component<AllProps, LocalState> {
    private resourcesDelta: ResourceStoreState;
    private resourcesRef: HTMLFieldSetElement | null;

    constructor(props: AllProps) {
        super(props);

        this.state = {
            selectedAdventurer: null,
        };

        this.resourcesDelta = {};
        this.resourcesRef = null;
    }

    public render() {
        const props = this.props;
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
            return <div>
                <label>level:</label>{ (level + 1) + " / " + structureDefinition.levels.length }
                <button
                    style = {{ float: "right" }}
                    onClick = { handleClick }
                    disabled= { !canUpgrade }
                >
                    { upgradeText }
                </button>
            </div>;
        };

        const handleDropItemWarehouse = (item: Item, fromSlot: number,
                                         toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
            switch (sourceType) {
                case warehouse:
                    if (props.onMoveItemInWarehouse) {
                        props.onMoveItemInWarehouse(fromSlot, toSlot);
                    }
                    break;
                case DragSourceType.adventurerInventory:
                    if (props.onMoveItemFromAdventurer) {
                        props.onMoveItemFromAdventurer(sourceId!, item, fromSlot, toSlot);
                    }
                    break;
            }
        };

        const handleAdventurerTabSelected = (tabId: string) => {
            this.setState({
                selectedAdventurer: tabId,
            });
        };

        const handleDropItemAdventurer = (item: Item, fromSlot: number,
                                          toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
            const adventurerId = this.state.selectedAdventurer!;
            switch (sourceType) {
                case DragSourceType.adventurerInventory:
                    if (props.onMoveItemInInventory) {
                        props.onMoveItemInInventory(adventurerId, fromSlot, toSlot);
                    }
                    break;
                case warehouse:
                    if (props.onMoveItemToAdventurer) {
                        props.onMoveItemToAdventurer(adventurerId, item, fromSlot, toSlot);
                    }
                    break;
            }
        };

        let adventurerContent = null;
        if (this.state.selectedAdventurer) {
            const adventurer = props.adventurersInTown.find((a) => a.id === this.state.selectedAdventurer)!;
            adventurerContent = <Inventory
                sourceType = { warehouse }
                items = { adventurer.inventory }
                onDropItem = { handleDropItemAdventurer }
            />;
        }

        const adventurersArea = <>
            <Tabstrip className = "adventurers-tabstrip" onTabSelected = { (tabId: string) => handleAdventurerTabSelected(tabId) } >
            { props.adventurersInTown.map((a) => {
                return <Tab id = { a.id } key = { a.id }>
                    <AdventurerAvatar adventurer = { a } className = "common-icon-small"/>
                </Tab>;
            }) }
            </Tabstrip>
            <div className = "adventurer-info">
                { adventurerContent }
            </div>
        </>;

        return (
            <details open = { true } className = "warehouse-structureview">
                <summary>{ displayName }</summary>
                { createUpgradeRow() }
                <fieldset className="resources" ref = { (ref) => { this.resourcesRef = ref; }}>
                    <legend>Resources</legend>
                    <ResourcesBox
                        resources = { props.resources }
                        maxResources = { props.maxResources }
                        deltaResources = { this.resourcesDelta }
                    />
                </fieldset>

                <Inventory
                    sourceType = { warehouse }
                    items = { props.items }
                    onDropItem = { handleDropItemWarehouse }
                />
                { adventurersArea }

            </details>
        );
    }

    public componentDidUpdate(prevProps: Readonly<AllProps>) {
        Object.keys(prevProps.resources).forEach((resource: string) => {
            this.resourcesDelta[resource] = this.props.resources[resource]! - prevProps.resources[resource]!;
        });

        if (this.resourcesRef) {
            this.resourcesRef.classList.remove("animate");
            setTimeout(() => {
                if (this.resourcesRef) {
                    this.resourcesRef.classList.add("animate");
                }
            }, 200);
        }
    }
}

export default WarehouseStructureView;
