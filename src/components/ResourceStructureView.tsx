// OBSOLETE
import * as React from 'react';
import './css/structureviewrow.css';
import structureDefinitions, { 
    StructureType, 
    ResourceStructureLevelDefinition, 
    ResourceStructureDefinition } from 'src/definitions/structures';

export interface DispatchProps {
    onUpgrade?: (cost:number) => void
}

export interface Props extends DispatchProps {
    type:StructureType,
    level?:number,
    workers?:number
    gold?:number
} 

export default function(props: Props) {  
    
    const structureDefinition:ResourceStructureDefinition = structureDefinitions[props.type];
    const level:number = props.level || 0;
    const levelDefinition:ResourceStructureLevelDefinition = structureDefinition.levels[level];
    const gold = props.gold || 0;
    const nextLevel = structureDefinition.levels[level + 1];
    const nextLevelCost = (nextLevel != null? nextLevel.cost || 0 : -1);
    const canUpgrade = nextLevel != null && gold >= nextLevelCost;
    const upgradeText = `Upgrade! (${nextLevelCost < 0 ? 'max' : nextLevelCost + ' gold'})`;

    const handleUpgrade = (event:React.MouseEvent<HTMLButtonElement>) => {
        if(props.onUpgrade) props.onUpgrade(nextLevelCost);
    }

    const generates = levelDefinition.generates;
    const generatesText = Object.keys(generates).reduce((accumulator:Array<string>, value:string) => {
        // For values that are not 0 
        if(generates[value]) accumulator.push(`${generates[value]} x ${props.workers} = ${generates[value] * (props.workers || 0)} ${value}`);
        return accumulator;
    }, []).join(',');

    return ( 
        // Todo: abstract some stuff to generic StructureView
        <fieldset>
            <legend>{structureDefinition.displayName}</legend>
            <label>level:</label> { (level + 1) + "/" + structureDefinition.levels.length }
            <label>workers:</label> { props.workers + "/" + levelDefinition.workerCapacity }
            <button onClick={handleUpgrade} disabled= { !canUpgrade } > { upgradeText } </button> 
            <div>
                { "This building generates (every tick): " }
                <br/>
                { generatesText }           
            </div>
        </fieldset>
    );
}


