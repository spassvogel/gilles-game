import { Item } from "definitions/items/types";

// export function pick<T extends string, TEnumValue extends number>(table: {[key in keyof T]?: TEnumValue}) : T { 
// export function pick<T =Item>(table: {[key in Item]?: number}) : T { 
export function pick(table: {[key in Item]?: number}) : Item { 
    const totalWeight = Object.values(table).reduce((acc, value) => (acc ?? 0 ) + (value ?? 0), 0) ?? 0;
    const randomNumber = Math.floor(Math.random() * totalWeight + 1);

    let weight = 0;
    const entries = Object.entries(table);
    for(let i = 0; i < entries.length; i++) {
        weight += entries[i][1]!;
        if (randomNumber <= weight) {
            return entries[i][0] as unknown as Item
        }
    }
    throw new Error()
}

/* Tests distribution */
export const test = () => {
    const lootTable: {[key in Item]?: number} = {
        "herb/bogroot": 2,
        "herb/winterWeed": 1
    }
    const result: {[key in Item]?: number} = {}
    for(let i = 0; i < 500; i++) {
        const picked = pick(lootTable);
        if (!result[picked]) {
            result[picked] = 0
        }
        result[picked]!++;
    }
    console.log(result)
}
// */