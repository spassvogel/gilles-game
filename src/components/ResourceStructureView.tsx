import * as React from 'react';
import './css/structureviewrow.css';
import structureDefinitions, { 
    Structure, 
    ResourceStructureLevelDefinition, 
    ResourceStructureDefinition } from 'src/definitions/structures';
import UpDownValue from './ui/UpDownValue';

export interface DispatchProps {
    onUpgrade?: (cost:number) => void
    onWorkersUp?: () => void
    onWorkersDown?: () => void
}

export interface Props extends DispatchProps {
    type:Structure,
    level?:number,
    workers?:number
    workersFree?:number
    gold?:number
} 

export default function(props: Props) {  
    
    const structureDefinition:ResourceStructureDefinition = structureDefinitions[props.type] as ResourceStructureDefinition;
    if(!structureDefinition) throw `No definition found for structure ${props.type} with type ResourceStructureDefinition.`
    const level:number = props.level || 0;
    const levelDefinition:ResourceStructureLevelDefinition = structureDefinition.levels[level];

    const createWorkersRow = () => {

        const handleUp = () => {
            if(props.onWorkersUp) props.onWorkersUp();
        }
        const handleDown = () => {
            if(props.onWorkersDown) props.onWorkersDown();            
        }

        const upDisabled = props.workers == levelDefinition.workerCapacity || (props.workersFree || 0) < 1;
        const downDisabled = props.workers == 0;
        return <UpDownValue 
            label="workers:" 
            value = { props.workers } 
            max = { levelDefinition.workerCapacity }
            upDisabled = { upDisabled } 
            downDisabled = { downDisabled }
            onDown = { handleDown }
            onUp = { handleUp }
        />;
    }

    const createUpgradeRow = () => {
        const gold = props.gold || 0;
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null? nextLevel.cost || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? 'max' : nextLevelCost + ' gold'})`;

        const handleUpgrade = (event:React.MouseEvent<HTMLButtonElement>) => {
            if(props.onUpgrade) props.onUpgrade(nextLevelCost);
        }
        return <button 
            onClick = { handleUpgrade } 
            disabled= { !canUpgrade } > 
                { upgradeText } 
        </button>;
    }

    const createGeneratesRow = () => {
        const generates = levelDefinition.generates;
        const generatesText = Object.keys(generates).reduce((accumulator:Array<string>, value:string) => {
            // For values that are not 0 
            if(generates[value]) accumulator.push(`${generates[value]} x ${props.workers} = ${generates[value] * (props.workers || 0)} ${value}`);
            return accumulator;
        }, []).join(',');
        return <div>
            { "This building generates (every tick): " }
            <br/>
            { generatesText }           
        </div>
    }

    return ( 
        // Todo: abstract some stuff to generic StructureView
        <fieldset>
            <legend>{structureDefinition.displayName}</legend>
            <label>level:</label>{ (level + 1) + " / " + structureDefinition.levels.length }
            { createWorkersRow() }
            { createUpgradeRow() }
            { createGeneratesRow() }

        </fieldset>
    );
}


