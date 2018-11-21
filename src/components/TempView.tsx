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
                <EquipmentViewRow name="crossbows"/>
                <EquipmentViewRow name="longbows" /> 
                <EquipmentViewRow name="swords" /> 
                <EquipmentViewRow name="daggers"/> 
                <EquipmentViewRow name="warPigs"/> 
            </fieldset>
        </div>
    );
}

export default ResourceView;

