// TODO: Better name than this
// UNUSED
import { DragSourceType } from "constants/dragging";
import { Item } from "definitions/items/types";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStoreState } from "stores/quest";
import { TextManager } from "utils/textManager";
import "./css/adventurersbox.css";
import AdventurerAvatar from "./ui/AdventurerAvatar";
import Inventory from "./ui/inventory/Inventory";
import { useState } from 'react';

export interface DispatchProps {
    onMoveItemInInventory?: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onMoveItemFromWarehouseToAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number) => void;
}

export interface StateProps {
    quests: QuestStoreState[];
    groupedAdventurers: Record<string, AdventurerStoreState[]>; // keyed by party
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface LocalState {
    selectedAdventurer: string|null;
}

type AllProps = Props & StateProps & DispatchProps;

/**
 * Adventurers grouped by quest
 */
const AdventurersBox = (props: AllProps) => {
    
    const [selectedAdventurer, setSelectedAdventurer] = useState<string | null>();

    const generateRow = (group: string, adventurers: AdventurerStoreState[]): JSX.Element => {
        // group is either the string "solo" or a partyId
        const adventurer = adventurers
            .find((adventurer) => adventurer.id === selectedAdventurer);
        let adventurerInfo = null;

        if (adventurer) {
            const handleDropItem = (item: Item, fromSlot: number,
                                    toSlot: number, sourceType: DragSourceType): void => {
                switch (sourceType) {
                    case DragSourceType.adventurerInventory:
                        if (props.onMoveItemInInventory) {
                            props.onMoveItemInInventory(selectedAdventurer!, fromSlot, toSlot);
                        }
                        break;
                    case DragSourceType.warehouse:
                        if (props.onMoveItemFromWarehouseToAdventurer) {
                            props.onMoveItemFromWarehouseToAdventurer(selectedAdventurer!,
                                item, fromSlot, toSlot);
                        }
                        break;
                }
            };
            adventurerInfo = <div className="adventurer-info">
                <div>{ adventurer!.name } </div>
                <div className="adventurer-info-container">
                    <div className="equipment">
                        <br />
                        [ TODO: GEAR ]
                    </div>
                    <Inventory
                        items = { adventurer.inventory }
                        sourceId = { selectedAdventurer! }
                        sourceType = { DragSourceType.adventurerInventory}
                        onDropItem = { handleDropItem }
                    />
                </div>
            </div>;
        }

        const quest = props.quests.find((q) => q.name === group);
        let name = "";
        let sigilImgPath = "";
        if (quest) {
            sigilImgPath = `img/sigils/${ quest.icon }`;
            name = TextManager.getQuestTitle(quest.name);
        }
        return <li key = { group } className = { "group" }>
            <div
                className = "sigil"
                style = { { backgroundImage: `url(${sigilImgPath})`} }
            ></div>
            <span className = "title" title = { name }> { name } </span>
            <ul className = "adventurer-portraits">
            { adventurers.map((adventurer) => generatePortrait(adventurer)) }
            </ul>
            { adventurerInfo }
        </li>;
    };

    const generatePortrait = (adventurer: AdventurerStoreState) => {
        const handleClick = () => {
            setSelectedAdventurer(selectedAdventurer === adventurer.id ? null : adventurer.id);
        };
        const className = adventurer.id === selectedAdventurer ? "selected" : undefined;
        return <li key={ adventurer.id } className={ className } >
            <AdventurerAvatar adventurer= { adventurer } onClick={ handleClick } />
        </li>;
    };

    const generateRows = () => {
        const rows = Object.keys(props.groupedAdventurers)
            .map((group) => generateRow(group, props.groupedAdventurers[group]));
        return rows;
    };

    return (
        <div className="adventurers-box">
            <h3>Adventurers</h3>
            <ul>
            { generateRows() }
            </ul>
        </div>
    );
}

export default AdventurersBox;
