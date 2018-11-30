
import * as React from 'react';
import { AdventurerStoreState } from 'src/stores/adventurer';
import './css/partyscreen.css';

export interface StateProps {
    adventurers:AdventurerStoreState[]
}

export interface Props {
    questName:string
}

export default function(props: Props & StateProps) {  
    
    const getAvatars = () => {
        return props.adventurers.map((adventurer:AdventurerStoreState) => {
            console.log(adventurer.avatarImg)
            return <div 
                key = { adventurer.id }
                className ="avatar" 
                //style = {{ backgroundImage: `url(${adventurer.avatarImg})` }}
            >
                <img src={ adventurer.avatarImg} />
                <div className="name">
                    { adventurer.name }
                </div>                
            </div>
        });
    }

    return ( 
        <div className="partyscreen">
            <div className="header">
                { props.questName }
            </div>
            <div className="avatars">
                { getAvatars() }
            </div>
            <div className="questlog">
                The quest log
            </div>
            <div className="actions">

            </div>
        </div>
    );
}

