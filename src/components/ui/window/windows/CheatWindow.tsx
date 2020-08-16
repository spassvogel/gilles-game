import { getDefinition } from "definitions/items";
import { Item, ItemType } from "definitions/items/types";
import { getDefinition as getStructureDefinition, Structure } from "definitions/structures";
import * as React from "react";
import { StructureState, StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";
import { TextManager } from "global/TextManager";
import { useRef, useState } from 'react';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { addLogText } from 'actions/log';
import { LogChannel } from 'stores/logEntry';
import { resourceOrder } from 'constants/resources';
import { ResourceStoreState } from 'stores/resources';
import { addResources } from 'actions/resources';
import { setStructureState } from 'actions/structures';
import { StoreState } from 'stores';
import { addGold } from 'actions/gold';
import { addItemToWarehouse } from 'actions/items';
import { addWorkers } from 'actions';
import { withWindow } from 'hoc/withWindow';
import "./styles/cheat.scss";


// tslint:disable-next-line:no-empty-interface
export interface Props {
}


const CheatWindow = (props: Props) => {

    const itemSelectRef = useRef<HTMLSelectElement>(null);
    const [cheats, setCheats] = useState({
        gold: 50,
        resources: 50,
        workers: 10,
    });
    const dispatch = useDispatch();

    const onCheatGold = (amount: number) => {
        dispatch(addGold(amount));
        dispatch(addLogText("common-cheat-gold-added", { amount }, LogChannel.common));
    };

    const onCheatItem = (item: Item) => {
        dispatch(addItemToWarehouse(item));
        dispatch(addLogText("common-cheat-item-added", { item }, LogChannel.common));
    };

    const onCheatResources = (amount: number) => {
        // Create ResourceStoreState where value of each resource is `amount`
        const resources = resourceOrder.reduce((acc: ResourceStoreState, resource) => {
            acc[resource] = amount;
            return acc;
        }, {});

        dispatch(addResources(resources));
        dispatch(addLogText("common-cheat-resources-added", { amount }, LogChannel.common));
    };

    const onCheatStructureState = (structure: Structure, state: StructureState) => {
        dispatch(setStructureState(structure, state))
    }

    const onCheatWorkers = (amount: number) => {
        dispatch(addWorkers(amount));
        dispatch(addLogText("common-cheat-workers-added", { amount }, LogChannel.common));
    };

    const structures = useSelector<StoreState, StructuresStoreState>(store => store.structures);


    const getStructureRow = (structure: Structure) => {
        const structureDef = getStructureDefinition(structure);
        const structureStore: StructureStoreState = structures[structure];
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
                checked={structureStore.state === StructureState.Built }
                onChange={() => handleChangeStructureState(structure, structureStore.state !== StructureState.Built)}
            />
        </div>;
    };

    const getItemTypeOptions = (type: ItemType) => {
        return Object.keys(Item)
            // eslint-disable-next-line eqeqeq
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
        onCheatGold(amount);

        const text = TextManager.get("common-cheat-gold-added", { amount });
        const icon = "/img/resources/gold.png";
        ToastManager.addToast(text, Type.cheat, icon);
    }

    const handleCheatWorkers = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const amount = cheats.workers;
        onCheatWorkers(amount);
        const text = TextManager.get("common-cheat-workers-added", { amount });
        const icon = "/img/resources/worker.png";
        ToastManager.addToast(text, Type.cheat, icon);
    }

    const handleCheatResources = (evt: React.MouseEvent<HTMLButtonElement>) => {
        onCheatResources(cheats.resources);
        const text = TextManager.get("common-cheat-resources-added", { amount: cheats.resources });
        ToastManager.addToast(text, Type.cheat);
    }

    const handleCheatItem = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const item = itemSelectRef.current!.value as Item;
        onCheatItem(item);

        const text = TextManager.get("common-cheat-item-added", { item });
        const icon = getDefinition(item).iconImg;
        ToastManager.addToast(text, Type.cheat, icon);
    }

    const handleChangeStructureState = (structure: Structure, checked: boolean) => {
        onCheatStructureState(structure, checked ? StructureState.Built : StructureState.NotBuilt);
        if (checked) {
            ToastManager.addToast(`The ${TextManager.getStructureName(structure)} is constructed`, Type.cheat);
        } else {
            ToastManager.addToast(`The ${TextManager.getStructureName(structure)} is not constructed`, Type.cheat);
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
        const amount = Number(event.target.value);
        setCheats({
            ...cheats,
            resources: amount,
        });
    }

    return (
        <div className="cheat-window">
            <div className="label-numberbox-button">
                <label>Gold</label>
                <input type="number"
                    value= {cheats.gold}
                    style={{width: "50px"}}
                    onChange={handleChangeGold}/>
                <button onClick={handleCheatGold}>Add</button>
            </div>
            <div className="label-numberbox-button">
                <label>Workers</label>
                <input type="number"
                    value= {cheats.workers}
                    style={{width: "50px"}}
                    onChange={handleChangeWorkers}/>
                <button onClick={handleCheatWorkers}>Add</button>
            </div>
            <div className="label-numberbox-button">
                <label>Resources</label>
                <input type="number"
                    value= {cheats.resources}
                    style={{width: "50px"}}
                    onChange={handleChangeResources}/>
                <button onClick={handleCheatResources}>Add</button>
            </div>
            <div className="label-numberbox-button">
                <label>Items</label>
                <select style={{width: "150px"}} ref={itemSelectRef}>
                    { items }
                </select>
                <button onClick={handleCheatItem}>Add</button>
            </div>
            { Object.keys(structures).map((structure) => getStructureRow(structure as Structure)) }
        </div>
    );
}

export default withWindow(CheatWindow);
