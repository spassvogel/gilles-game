import * as React from 'react';
import './css/tempview.css';
import ResourceViewRow from '../containers/ResourceViewRow';
import { Resource } from 'src/definitions/resources';
import ResourceStructureView from 'src/containers/ResourceStructureView';
import { Structure } from 'src/definitions/structures';
import { Equipment } from 'src/definitions/equipment';
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
                        <EquipmentViewRow type = { Equipment.crossbow }/>
                        <EquipmentViewRow type = { Equipment.longbow }/>
                        <EquipmentViewRow type = { Equipment.sword }/> 
                        <EquipmentViewRow type = { Equipment.dagger }/> 
                        <EquipmentViewRow type = { Equipment.torch }/>
                    </section>
                </details>
            </fieldset>


            {/* <StructureViewRow type = { Equipment.ironMines"/> */}
                {/* <StructureViewRow type = { Equipment.forges"/>
                <StructureViewRow type = { Equipment.blacksmiths"/>
                <StructureViewRow type = { Equipment.stables"/>
                <StructureViewRow type = { Equipment.tanneries"/> */}
                {/* <StructureViewRow type = { Equipment.farms"/> */}
                {/* <StructureViewRow type = { Equipment.alchemists"/> */}

             
            <fieldset>
                <legend>Resources</legend>
                <ResourceViewRow type = { Resource.wood }/>
                <ResourceViewRow type = { Resource.iron }/>
                <ResourceViewRow type = { Resource.steel }/>
                <ResourceViewRow type = { Resource.food }/>
                <ResourceViewRow type = { Resource.gunpowder }/>
                <ResourceViewRow type = { Resource.leather }/>
            </fieldset>

            <fieldset>
                <legend>Cheats</legend>
                <button onClick={ () => handleCheatGold(20)}> Geiv 20 gold</button><br/>
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

