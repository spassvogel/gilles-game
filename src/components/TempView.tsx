import * as React from 'react';
import './css/tempview.css';
import ResourceViewRow from '../containers/ResourceViewRow';
import { ResourceType } from 'src/definitions/resources';
import ResourceStructureView from 'src/containers/ResourceStructureView';
import { Structure } from 'src/definitions/structures';
import ProductionStructureView from 'src/containers//ProductionStructureView';
import EquipmentViewRow from 'src/containers/EquipmentViewRow';
import { ResourceStoreState } from 'src/stores/resources';

export interface DispatchProps {
    onCheatGold?: (amount:number) => void
    onCheatResources?: (amount:ResourceStoreState) => void
}

export interface Props extends DispatchProps {
}  

export default function(props:Props) {
    const handleCheatGold = (amount:number) => {
        if(props.onCheatGold) props.onCheatGold(amount);
    }
    const handleCheatResources = (amount:ResourceStoreState) => {
        if(props.onCheatResources) props.onCheatResources(amount);
    }
    return (
        <div className = "temp-view">
            <fieldset>
                <legend>Town</legend>
                <ResourceStructureView type={ Structure.lumberMill  }/>
                <ResourceStructureView type={ Structure.ironMine  }/>
                <ResourceStructureView type={ Structure.farm  }/>
                <ResourceStructureView type={ Structure.tannery  }/>
                
                <ProductionStructureView type={ Structure.blacksmith  }/>

                <details className = "structureview">
                    <summary>The storehouse</summary>
                    <section>
                        <EquipmentViewRow name = "crossbow"/>
                        <EquipmentViewRow name = "longbow"/>
                        <EquipmentViewRow name = "sword"/> 
                        <EquipmentViewRow name = "dagger"/> 
                        <EquipmentViewRow name = "warPig"/>
                    </section>
                </details>
            </fieldset>


            {/* <StructureViewRow name = "ironMines"/> */}
                {/* <StructureViewRow name = "forges"/>
                <StructureViewRow name = "blacksmiths"/>
                <StructureViewRow name = "stables"/>
                <StructureViewRow name = "tanneries"/> */}
                {/* <StructureViewRow name = "farms"/> */}
                {/* <StructureViewRow name = "alchemists"/> */}

            <fieldset>

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
                <button onClick={ () => handleCheatResources({
                    food: 100,
                    gunpowder: 100,
                    iron: 100,
                    leather: 100,
                    steel: 100,
                    wood: 100
                })}> Geiv 100 all resources</button>
            </fieldset> 
        </div>
    );
}

