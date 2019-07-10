import * as React from "react";
import structureDefinitions, {  Structure  } from "src/definitions/structures";
import { ResourceStructureDefinition, ResourceStructureLevelDefinition } from "src/definitions/structures/types";
import { TextManager } from "src/utils/textManager";
import UpDownValue from "../ui/UpDownValue";

export interface DispatchProps {
    onUpgrade?: (cost: number) => void;
    onWorkersUp?: () => void;
    onWorkersDown?: () => void;
}

export interface Props  {
    type: Structure;
    level?: number;
    workers?: number;
    workersFree?: number;
    gold?: number;
}

const ResourceStructureView = (props: Props & DispatchProps) => {

    const structureDefinition = structureDefinitions[props.type] as ResourceStructureDefinition;
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.type} with type ResourceStructureDefinition.`);
    }
    const level: number = props.level || 0;
    const levelDefinition: ResourceStructureLevelDefinition = structureDefinition.levels[level];
    const displayName = TextManager.get(levelDefinition.displayName);

    const createWorkersRow = () => {

        const handleUp = () => {
            if (props.onWorkersUp) { props.onWorkersUp(); }
        };
        const handleDown = () => {
            if (props.onWorkersDown) { props.onWorkersDown(); }
        };

        const upDisabled = props.workers === levelDefinition.workerCapacity || (props.workersFree || 0) < 1;
        const downDisabled = props.workers === 0;
        return <UpDownValue
            label="workers:"
            value = { props.workers }
            max = { levelDefinition.workerCapacity }
            upDisabled = { upDisabled }
            downDisabled = { downDisabled }
            onDown = { handleDown }
            onUp = { handleUp }
        />;
    };

    const createUpgradeRow = () => {
        const gold = props.gold || 0;
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (props.onUpgrade) { props.onUpgrade(nextLevelCost); }
        };
        return <div>
            <label>level:</label>{ (level + 1) + " / " + structureDefinition.levels.length }
            <button
                style={{float: "right"}}
                onClick = { handleClick }
                disabled= { !canUpgrade } >
                    { upgradeText }
            </button>
        </div>;
    };

    const createGeneratesRow = () => {
        const generates = levelDefinition.generates;
        const generatesText = Object.keys(generates).reduce((accumulator: string[], value: string) => {
            // For values that are not 0
            if (generates[value]) {
                // tslint:disable-next-line:max-line-length
                accumulator.push(`${generates[value]} x ${props.workers} = ${generates[value] * (props.workers || 0)} ${value}`);
            }
            return accumulator;
        }, []).join(",");
        return <div>
            { "Generates (every minute): " }
            <br/>
            { generatesText }
        </div>;
    };

    return (
        // TODO: abstract some stuff to generic StructureView
        <details open = { true } className = "structureview">
            <summary>{ displayName }</summary>
            <section>
                { createWorkersRow() }
                { createUpgradeRow() }
                { createGeneratesRow() }
            </section>
        </details>
    );
};

export default ResourceStructureView;
