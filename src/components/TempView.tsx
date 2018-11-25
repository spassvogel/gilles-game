import * as React from 'react';
import './css/tempview.css';
import ResourceViewRow from '../containers/ResourceViewRow';
import { ResourceType } from 'src/definitions/resources';
import ResourceStructureView from 'src/containers/ResourceStructureView';
import { StructureType } from 'src/definitions/structures';

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
        <div className="temp-view">
            <ResourceStructureView type={ StructureType.lumberMill }/>
            <ResourceStructureView type={ StructureType.farm }/>
            <ResourceStructureView type={ StructureType.tannery }/>


            {/* <StructureViewRow name="ironMines"/> */}
                {/* <StructureViewRow name="forges"/>
                <StructureViewRow name="blacksmiths"/>
                <StructureViewRow name="stables"/>
                <StructureViewRow name="tanneries"/> */}
                {/* <StructureViewRow name="farms"/> */}
                {/* <StructureViewRow name="alchemists"/> */}
             
            <fieldset>
                <legend>Resources</legend>
                <ResourceViewRow type={ResourceType.wood}/>
                <ResourceViewRow type={ResourceType.steel}/>
                <ResourceViewRow type={ResourceType.food}/>
                <ResourceViewRow type={ResourceType.gunpowder}/>
                <ResourceViewRow type={ResourceType.leather}/>
            </fieldset>


            {/* <fieldset>
                <legend>Equipment</legend>
                <EquipmentViewRow name="crossbows" requirements={ { wood: 2, steel: 1, food: 0, gunpowder: 0, iron: 0, leather: 0} }/>
                <EquipmentViewRow name="longbows"  requirements={ { wood: 3, steel: 1, food: 0, gunpowder: 0, iron: 0, leather: 0} }/>
                <EquipmentViewRow name="swords"    requirements={ { wood: 2, steel: 2, food: 0, gunpowder: 0, iron: 0, leather: 0} }/> 
                <EquipmentViewRow name="daggers"   requirements={ { wood: 1, steel: 1, food: 0, gunpowder: 0, iron: 0, leather: 0} }/> 
                <EquipmentViewRow name="warPigs"   requirements={ { wood: 0, steel: 1, food: 1, gunpowder: 0, iron: 0, leather: 1} }/>
            </fieldset> */}
            <fieldset>
                <legend>Cheats</legend>
                <button onClick={ () => handleCheatGold(20)}> Geiv 20 gold</button>
            </fieldset> 
        </div>
    );
}

