// OBSOLETE
import * as React from 'react';
import './css/structureviewrow.css';
import structureDefinitions, { 
    StructureType, 
    ResourceStructureLevelDefinition, 
    ResourceStructureDefinition } from 'src/definitions/structures';

export interface DispatchProps {
    onUpgrade?: () => void
}

export interface Props extends DispatchProps {
    type:StructureType,
    level?:number,
    workers?:number
    gold?:number
} 

export default function(props: Props) {  
    
    const handleUpgrade = (event:React.MouseEvent<HTMLButtonElement>) => {
        if(props.onUpgrade) props.onUpgrade();
    }
    const structureDefinition:ResourceStructureDefinition = structureDefinitions[props.type];
    const level:number = props.level || 0;
    const levelDefinition:ResourceStructureLevelDefinition = structureDefinition.levels[level];
    const gold = props.gold || 0;
    const nextLevel = structureDefinition.levels[level + 1];
    const canUpgrade = nextLevel != null && gold >= (nextLevel.cost || 0);
    
    return ( 
        // Todo: abstract some stuff to generic StructureView
        <fieldset>
            <legend>{structureDefinition.displayName}</legend>
            <label>level:</label> { (level + 1) + "/" + structureDefinition.levels.length }
            <label>workers:</label> { props.workers + "/" + levelDefinition.workerCapacity }
            <button onClick={handleUpgrade} disabled= { !canUpgrade } > Upgrade! </button>            
        </fieldset>
    );
}


