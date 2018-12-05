
import * as React from "react";
import { AdventurerStoreState } from "src/stores/adventurer";
import "./css/partyscreen.css";

export interface StateProps {
    adventurers: AdventurerStoreState[];
}

export interface Props {
    questName: string;
}

interface LocalState {
    selectedAdventurer: string | null;
}

export default class PartyScreen extends React.Component<Props & StateProps, LocalState> {

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
            const selected = this.state.selectedAdventurer === adventurer.id;
            return <div
                key = { `${adventurer.id}-avatar` }
                className = { "avatar" + (selected ? " selected" : "")}
                onClick = { () => this.handleAvatarClick(adventurer.id) }
                // style = {{ backgroundImage: `url(${adventurer.avatarImg})` }}
            >
                <img src={ adventurer.avatarImg} />
                <div className="name">
                    { adventurer.name }
                </div>
            </div>;
        });
    }

    private getBottomPart =     () => {
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
