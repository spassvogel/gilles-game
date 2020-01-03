import { getDefinition } from "definitions/items";
import { Item, ItemType } from "definitions/items/types";
import { getDefinition as getStructureDefinition, Structure } from "definitions/structures";
import * as React from "react";
import { StructureState, StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";
import { TextManager } from "utils/textManager";
import "./css/cheatbox.css";
import { useRef, useState } from 'react';

export interface DispatchProps {
    onCheatGold?: (amount: number) => void;
    onCheatWorkers?: (amount: number) => void;
    onCheatResources?: (amount: number) => void;
    onCheatItem?: (item: Item) => void;
    onCheatStructureState?: (structure: Structure, state: StructureState) => void;
}

export interface StateProps {
    structures: StructuresStoreState;
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

type AllProps = Props & StateProps & DispatchProps;

const CheatWindow = (props: AllProps) => {

    const itemSelectRef = useRef<HTMLSelectElement>(null);
    const [cheats, setCheats] = useState({
        gold: 50,
        resources: 50,
        workers: 10,
    });

    const getStructureRow = (structure: Structure) => {
        const structureDef = getStructureDefinition(structure);
        const structureStore: StructureStoreState = props.structures[structure];
        const levelDef = structureDef.levels[structureStore.level];

        const displayName = TextManager.get(levelDef.displayName);

        return <div
            className="label-dropdown"
            key={structure}
        >
            <label title={structure}>
                { `${displayName}` }
            </label>
            <input
                key={structure}
                type="checkbox"
                checked={props.structures[structure].state === StructureState.Built }
                onChange={() => handleChangeStructureState(structure, props.structures[structure].state !== StructureState.Built)}
            />
        </div>;
    };

    const structures = Object.keys(props.structures)
        .map((structure) => getStructureRow(structure as Structure));

    const getItemTypeOptions = (type: ItemType) => {
        return Object.keys(Item)
            // tslint:disable-next-line: triple-equals
            .filter((item: string) => getDefinition(item as Item).itemType == type)
            .map((item: string) => getItemOption(item as Item));
    };

    const getItemOption = (item: Item) => {
        return <option value ={item } key ={item }>
            { TextManager.getItemName(item) }
        </option>;
    };

    const items = Object.keys(ItemType)
        .filter((val: any) => !isNaN(val))
        .map((type: string) => {
        return <optgroup label ={ItemType[type] } key ={type }>
            { getItemTypeOptions(type as unknown as ItemType) }
        </optgroup>;
    });

    
    const handleCheatGold = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const amount = cheats.gold;
        if (props.onCheatGold) { props.onCheatGold(amount); }
    }

    const handleCheatWorkers = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const amount = cheats.workers;
        if (props.onCheatWorkers) { props.onCheatWorkers(amount); }
    }

    const handleCheatResources = (evt: React.MouseEvent<HTMLButtonElement>) => {
        if (props.onCheatResources) { props.onCheatResources(cheats.resources); }
    }

    const handleCheatItem = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const item = itemSelectRef.current!.value as Item;
        if (props.onCheatItem) { props.onCheatItem(item); }
    }

    const handleChangeStructureState = (structure: Structure, checked: boolean) => {
        if (props.onCheatStructureState) {
            props.onCheatStructureState(structure, checked ? StructureState.Built : StructureState.NotBuilt);
        }
    }

    const handleChangeGold = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(event.target.value);
        setCheats({
            ...cheats,
            gold: amount,
        });
    }

    const handleChangeWorkers = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(event.target.value);
        setCheats({
            ...cheats,
            workers: amount,
        });
    }

    const handleChangeResources = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(event.target.checked);
        setCheats({
            ...cheats,
            resources: amount,
        });
    }

    return (
        <div className="cheat-box">
            <div className="label-numberbox-button">
                <label>Gold</label>
                <input type="number"
                    value= {cheats.gold}
                    style={{width: "50px"}}
                    onChange={handleChangeGold}>
                </input>
                <button onClick={handleCheatGold}>Add</button>
            </div>
            <div className="label-numberbox-button">
                <label>Workers</label>
                <input type="number"
                    value= {cheats.workers}
                    style={{width: "50px"}}
                    onChange={handleChangeWorkers}>
                </input>
                <button onClick={handleCheatWorkers}>Add</button>
            </div>
            <div className="label-numberbox-button">
                <label>Resources</label>
                <input type="number"
                    value= {cheats.resources}
                    style={{width: "50px"}}
                    onChange={handleChangeResources}>
                </input>
                <button onClick={handleCheatResources}>Add</button>
            </div>
            <div className="label-numberbox-button">
                <label>Items</label>
                <select style={{width: "150px"}} ref={itemSelectRef}>
                    { items }
                </select>
                <button onClick={handleCheatItem}>Add</button>
            </div>
            { structures }
        </div>
    );
}

export default CheatWindow;
