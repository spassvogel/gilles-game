
import * as React from 'react';
import { AdventurerStoreState } from 'src/stores/adventurer';
import './css/partyscreen.css';

export interface StateProps {
    adventurers:AdventurerStoreState[]
}

export interface Props {
    questName:string
}

interface LocalState {
    selectedAdventurer:string | null
}

export default class PartyScreen extends React.Component<Props & StateProps, LocalState> {
    constructor(props: Props & StateProps) {
        super(props);

        this.state = {
            selectedAdventurer: null
        };
    }

    render() {    
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

    private getAvatars = () => {
        return this.props.adventurers.map((adventurer:AdventurerStoreState) => {
            const selected = this.state.selectedAdventurer == adventurer.id;
            return <div 
                key = { adventurer.id }
                className = { "avatar" + (selected ? " selected" : "")}  
                onClick = { () => this.handleAvatarClick(adventurer.id) }
                //style = {{ backgroundImage: `url(${adventurer.avatarImg})` }}
            >
                <img src={ adventurer.avatarImg} />
                <div className="name">
                    { adventurer.name }
                </div>                
            </div>
        });
    }

    private getBottomPart = () => {
        if(this.state.selectedAdventurer) {
            const adventurer:AdventurerStoreState = this.props.adventurers.find(a => a.id == this.state.selectedAdventurer)!;
            return <div>  { adventurer.name }</div>
        }
        else {
            return [
            <div className="questlog">
                The quest log            
            <div className="actions">                
            </div>
            </div>];
        }        
    }

    handleAvatarClick(adventurerId:string | null): void {
        if(this.state.selectedAdventurer == adventurerId){
            adventurerId = null;
        }
        this.setState({
            selectedAdventurer: adventurerId
        })
    }

}

