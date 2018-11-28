// OBSOLETE
import * as React from 'react';
import './css/structureviewrow.css';
import structureDefinitions, { 
    Structure, 
    ProductionStructureDefinition,
    ProductionStructureLevelDefinition,
    ProductionDefinition} from 'src/definitions/structures';
import UpDownValue from './ui/UpDownValue';
import equipment from 'src/definitions/equipment';
import { ResourceStoreState } from 'src/stores/resources';
import Progressbar from './ui/Progressbar';

export interface DispatchProps {
    onUpgrade?: (cost:number) => void
    onWorkersUp?: () => void
    onWorkersDown?: () => void
    onCraft?: (productionDefinition:ProductionDefinition) => void
}

export interface Props extends DispatchProps {
    type: Structure,
    resources?:ResourceStoreState,
    level?:number,
    workers?:number,
    workersFree?:number,
    gold?:number
    TEMP_PROGRESS?:number
} 

export default function(props: Props) {  
    
    const structureDefinition:ProductionStructureDefinition = structureDefinitions[props.type] as ProductionStructureDefinition;
    if(!structureDefinition) throw `No definition found for structure ${props.type} with type ProductionStructureDefinition.`
    const level:number = props.level || 0;
    const levelDefinition:ProductionStructureLevelDefinition = structureDefinition.levels[level];

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

        const handleClick = (event:React.MouseEvent<HTMLButtonElement>) => {
            if(props.onUpgrade) props.onUpgrade(nextLevelCost);
        }
        return <button 
            onClick = { handleClick } 
            disabled= { !canUpgrade } > 
                { upgradeText } 
        </button>;
    }

    const createCraftRows = () => {
        const handleClick = (productionDefinition:ProductionDefinition) => {
            if(props.onCraft) props.onCraft(productionDefinition);
        }

        /**
         * Formats the requirements for this equipment in a nice string
         * @param costs 
         */
        const makeCostsString = (costs:ResourceStoreState):string => {
            return Object.keys(costs).reduce((accumulator:Array<string>, value) => {
                if(costs[value]) accumulator.push(`${value}: ${costs[value]}`);
                return accumulator;
            }, []).join(', ');
        } 

        return levelDefinition.produces.map(produces => {
            // Check if we have enough resources
            const playerResources = props.resources || {};
            const disabled = Object.keys(produces.cost).some(resource => produces.cost[resource] > playerResources[resource]);
            return <div key = { 'craft' + produces.equipment } >
                <button 
                    disabled = {disabled} 
                    onClick = { () => handleClick(produces) }> 
                    { produces.equipment } 
                </button>
                { makeCostsString(produces.cost) }
            </div>
        });
    }

    return ( 
        // Todo: abstract some stuff to generic StructureView
        <details open = { true } className = "structureview">
            <summary>{structureDefinition.displayName}</summary>
            <section>
                <label>level:</label>{ (level + 1) + " / " + structureDefinition.levels.length }
                { createWorkersRow() }
                { createUpgradeRow() }
                <div>craft:</div>
                { createCraftRows() }
                <Progressbar progress={ props.TEMP_PROGRESS || 0 }/>
            </section>
        </details>
    );
}


