import * as React from 'react';
import './css/tempview.css';
import StructureViewRow from '../containers/StructureViewRow';
import ResourceViewRow from '../containers/ResourceViewRow';
import EquipmentViewRow from '../containers/EquipmentViewRow';


function ResourceView() {
    return (
        <div className="temp-view">
            <fieldset>
                <legend>Structures</legend>
                <StructureViewRow name="lumberMills"/>
                <StructureViewRow name="ironMines"/>
                <StructureViewRow name="forges"/>
                <StructureViewRow name="blacksmiths"/>
                <StructureViewRow name="stables"/>
                <StructureViewRow name="tanneries"/>
                <StructureViewRow name="farms"/>
                <StructureViewRow name="alchemists"/>
            </fieldset>
            <fieldset>
                <legend>Resources</legend>
                <ResourceViewRow name="wood"/>
                <ResourceViewRow name="iron"/>
                <ResourceViewRow name="gunpowder"/>
                <ResourceViewRow name="pigs"/>
            </fieldset>
            <fieldset>
                <legend>Equipment</legend>
                <EquipmentViewRow name="crossbows" requirements={ { wood: 2, steel: 1, pigs: 0, gunpowder: 0, iron: 0, leather: 0} }/>
                <EquipmentViewRow name="longbows"  requirements={ { wood: 3, steel: 1, pigs: 0, gunpowder: 0, iron: 0, leather: 0} }/>
                <EquipmentViewRow name="swords"    requirements={ { wood: 2, steel: 2, pigs: 0, gunpowder: 0, iron: 0, leather: 0} }/> 
                <EquipmentViewRow name="daggers"   requirements={ { wood: 1, steel: 1, pigs: 0, gunpowder: 0, iron: 0, leather: 0} }/> 
                <EquipmentViewRow name="warPigs"   requirements={ { wood: 0, steel: 1, pigs: 1, gunpowder: 0, iron: 0, leather: 1} }/>
            </fieldset>
        </div>
    );
}

export default ResourceView;

