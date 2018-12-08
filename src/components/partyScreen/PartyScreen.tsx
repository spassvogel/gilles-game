
import * as React from "react";
import { AdventurerStoreState } from "src/stores/adventurer";
import AdventurerAvatar from "./AdventurerAvatar";
import "./css/partyscreen.css";
import EquipmentIcon, { InventoryItemDragInfo } from "./EquipmentIcon";
import InventorySlot from "./InventorySlot";

export interface StateProps {
    adventurers: AdventurerStoreState[];
}

export interface Props {
    questName: string;
}

export interface DispatchProps {
    onMoveItemInInventory?: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onMoveItemToOtherAdventurer?: (fromAdventurerId: string, fromSlot: number, toAdventurerId: string) => void;
}

interface LocalState {
    selectedAdventurer: string | null;
}

export default class PartyScreen extends React.Component<Props & StateProps & DispatchProps, LocalState> {
    // This Component has local state, so it's a class
    constructor(props: Props & StateProps) {
        super(props);

        this.state = {
            selectedAdventurer: null,
        };
    }

    public render() {
        return (
            <div className="partyscreen">
                <div className="header">
                    { this.props.questName }
                </div>
                <div className="avatars">
                    { this.getAvatars() }
                </div>
                { this.getBottomPart() }
            </div>
        );
    }

    public getAdventurerInfo(adventurer: AdventurerStoreState): any {
        const attributes = Object.keys(adventurer.stats).map((stat) => {
            const value: number = adventurer.stats[stat];
            return <div key= { `${adventurer.id}-${stat}`} > <b>{ stat }</b>: { value.toFixed(1) } </div>;
        });
        const gearList = Object.keys(adventurer.gear).map((gear) => {
            return <div key= { `${adventurer.id}-${gear}`} ><b>{ gear }</b>: { adventurer.gear[gear] }  </div>;
        });

        const inventory = [];

        for (let i = 0; i < adventurer.inventory.length; i++) {
            let contents;
            const item = adventurer.inventory[i];
            if (item) {
                contents = <EquipmentIcon
                    index={i} key={ `inventory-slot-${i}`}
                    item = { item }>
                </EquipmentIcon>;
            }
            const handleDrop = (dragInfo: InventoryItemDragInfo) => {
                if (dragInfo.inventorySlot === i) {
                    return;
                }

                if (this.props.onMoveItemInInventory) {
                    const { inventorySlot: fromSlot} = dragInfo;
                    this.props.onMoveItemInInventory(adventurer.id, fromSlot!, i);
                }
            };

            // tslint:disable-next-line:max-line-length
            const slot = <InventorySlot
                key= { `inventory-slot-${i}`}
                empty = { contents === undefined }
                onDrop= { handleDrop }>
                 { contents }
            </InventorySlot>;
            inventory.push(slot);
        }

        return (
        <div className="adventurer-container">
            <div className="left">
                <div className="name">
                    <b>{ adventurer.name }</b>
                </div>
                <div className="attributes">
                    { attributes }
                </div>
                <div className="gear">
                    { gearList }
                </div>
            </div>
            <div className="right">
                <div className="inventory">
                    { inventory }
                </div>
            </div>
        </div>
        );
    }

    public handleAvatarClick(adventurerId: string | null): void {
        if (this.state.selectedAdventurer === adventurerId) {
            adventurerId = null;
        }
        this.setState({
            selectedAdventurer: adventurerId,
        });
    }

    private getAvatars = () => {
        return this.props.adventurers.map((adventurer: AdventurerStoreState) => {
            const handleDrop = (dragInfo: InventoryItemDragInfo) => {
                const fromAdventurer = this.state.selectedAdventurer!; // The adventurer that has the item
                if (adventurer.id === fromAdventurer) {
                    // Dropping on yourself.. nothing happens
                    return;
                }

                if (this.props.onMoveItemToOtherAdventurer) {
                    const { inventorySlot: fromSlot} = dragInfo;
                    this.props.onMoveItemToOtherAdventurer(fromAdventurer, fromSlot!, adventurer.id);
                }
            };

            const active = this.state.selectedAdventurer === adventurer.id;
            return <AdventurerAvatar
                key = { `${adventurer.id}-avatar` }
                active = { active }
                adventurer = { adventurer }
                onClick = { () => this.handleAvatarClick(adventurer.id) }
                onDrop = { handleDrop }
            />;
        });
    }

    private getBottomPart = () => {
        if (this.state.selectedAdventurer) {
            const adventurer: AdventurerStoreState = this.props.adventurers
                .find((a) => a.id === this.state.selectedAdventurer)!;
            return this.getAdventurerInfo(adventurer);
        } else {
            return (
            <div className="questlog">
                The quest log
            <div className="actions">
            </div>
            </div>);
        }
    }

}
