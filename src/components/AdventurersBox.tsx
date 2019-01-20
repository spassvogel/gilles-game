// TODO: Better name than this

import * as React from "react";
import { AdventurerStoreState } from "src/stores/adventurer";
import { PartyStoreState } from "src/stores/party";
import "./css/adventurersbox.css";
import AdventurerAvatar from "./partyScreen/AdventurerAvatar";
import Inventory from "./ui/inventory/Inventory";
import { DragSourceType } from "src/constants";

export interface DispatchProps {
    onMoveItemInInventory?: (adventurerId: string, fromSlot: number, toSlot: number) => void;
}

export interface StateProps {
    parties: Record<string, PartyStoreState>;
    groupedAdventurers: Record<string, AdventurerStoreState[]>; // keyed by party
}

export interface Props {
}

interface LocalState {
    selectedAdventurer: string|null;
}

type AllProps = Props & StateProps & DispatchProps;
class AdventurersBox extends React.Component<AllProps, LocalState> {

    /**
     *
     */
    constructor(props: AllProps) {
        super(props);

        this.state = {
            selectedAdventurer: null,
        };
    }

    public render() {

        const generateRow = (group: string, adventurers: AdventurerStoreState[]): JSX.Element => {
            // group is either the string "solo" or a partyId
            console.log(adventurers)
            const selectedAdventurer = adventurers.find((adventurer) => adventurer.id === this.state.selectedAdventurer)
            let adventurerInfo = null;
            if (selectedAdventurer) {
                const handleMoveItem = (fromSlot: number, toSlot: number): void => {
                    if (this.props.onMoveItemInInventory) {
                        this.props.onMoveItemInInventory(selectedAdventurer.id, fromSlot, toSlot);
                    }
                };
                adventurerInfo = <div className="adventurer-info">
                    <div>{ selectedAdventurer.name } </div>
                    <div className="adventurer-info-container">
                        <div className="gear">
                            <br />
                            [ TODO: GEAR ]
                        </div>
                        <Inventory
                            items={selectedAdventurer.inventory}
                            source={DragSourceType.adventurer}
                            onMoveItem={handleMoveItem}
                        />
                    </div>
                </div>;
            }
            return <li key={ group } className={ "group" }>
                <div className="sigil"></div>
                <ul className="adventurer-portraits">
                { adventurers.map((adventurer) => generatePortrait(adventurer)) }
                </ul>
                { adventurerInfo }
            </li>;
        };

        const generatePortrait = (adventurer: AdventurerStoreState) => {
            const handleClick = () => {
                const selectedAdventurer = this.state.selectedAdventurer === adventurer.id ? null : adventurer.id;
                this.setState({
                    selectedAdventurer,
                });
            }
            const className = adventurer.id === this.state.selectedAdventurer ? "selected" : undefined;
            return <li key={ adventurer.id } className={ className } >
                <AdventurerAvatar adventurer= { adventurer } onClick={ handleClick } />
            </li>;
        };

        const generateRows = () => {
            const rows = Object.keys(this.props.groupedAdventurers)
                .map((group) => generateRow(group, this.props.groupedAdventurers[group]));
            return rows;
        };

        return (
            <ul className="adventurers-box">
                { generateRows() }
            </ul>
        );
    }
}

export default AdventurersBox;
