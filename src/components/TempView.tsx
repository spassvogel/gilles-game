import * as React from 'react';
import './css/tempview.css';
import ResourceViewRow from '../containers/ResourceViewRow';
import { ResourceType } from 'src/definitions/resources';
import ResourceStructureView from 'src/containers/ResourceStructureView';
import { Structure } from 'src/definitions/structures';
import ProductionStructureView from 'src/containers//ProductionStructureView';
import EquipmentViewRow from 'src/containers/EquipmentViewRow';

export interface DispatchProps {
    onCheatGold?: (amount:number) => void
}

export interface Props extends DispatchProps {
}  

export default function(props:Props) {
    const handleCheatGold = (amount:number) => {
        if(props.onCheatGold) props.onCheatGold(amount);
    }
    return (
        <div className = "temp-view">
            <ResourceStructureView type={ Structure.lumberMill  }/>
            <ResourceStructureView type={ Structure.ironMine  }/>
            <ResourceStructureView type={ Structure.farm  }/>
            <ResourceStructureView type={ Structure.tannery  }/>
            
            <ProductionStructureView type={ Structure.blacksmith  }/>


            {/* <StructureViewRow name = "ironMines"/> */}
                {/* <StructureViewRow name = "forges"/>
                <StructureViewRow name = "blacksmiths"/>
                <StructureViewRow name = "stables"/>
                <StructureViewRow name = "tanneries"/> */}
                {/* <StructureViewRow name = "farms"/> */}
                {/* <StructureViewRow name = "alchemists"/> */}

            <fieldset>
                <legend>The storehouse</legend>
                <EquipmentViewRow name = "crossbow"/>
                <EquipmentViewRow name = "longbow"/>
                <EquipmentViewRow name = "sword"/> 
                <EquipmentViewRow name = "dagger"/> 
                <EquipmentViewRow name = "warPig"/>
            </fieldset> 
             
            <fieldset>
                <legend>Resources</legend>
                <ResourceViewRow type = { ResourceType.wood }/>
                <ResourceViewRow type = { ResourceType.iron }/>
                <ResourceViewRow type = { ResourceType.steel }/>
                <ResourceViewRow type = { ResourceType.food }/>
                <ResourceViewRow type = { ResourceType.gunpowder }/>
                <ResourceViewRow type = { ResourceType.leather }/>
            </fieldset>

            <fieldset>
                <legend>Cheats</legend>
                <button onClick={ () => handleCheatGold(20)}> Geiv 20 gold</button>
            </fieldset> 
        </div>
    );
}

