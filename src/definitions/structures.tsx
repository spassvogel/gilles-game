import { ResourceStoreState } from 'src/stores/resources';

export enum StructureType {
    lumberMill = "lumberMill",
    farm = "farm"
}

interface StructureDefinition {
    displayName: string
    //type: StructureType
}

interface StructureLevelDefinition {
    cost?:number             // in gold
    workerCapacity:number   // number of workers that can work at this structure at this level
}

export interface ResourceStructureDefinition extends StructureDefinition {
    levels:(ResourceStructureLevelDefinition)[]
}

export interface ResourceStructureLevelDefinition extends StructureLevelDefinition {
    generates:ResourceStoreState,
}


const lumberMill:ResourceStructureDefinition = {
    displayName: "Johns lumber mill",
    levels: [{
        // level 0:
        workerCapacity: 2,
        generates: { wood: 2 }
    }, {
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { wood: 5 }
    }, {
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { wood: 7 }
    }]
}

const farm:ResourceStructureDefinition = {
    displayName: "Marvins farm",
    levels: [{
        // level 1:
        workerCapacity: 2,
        generates: { food: 2 }
    }, {
        // level 2:
        workerCapacity: 5,
        cost: 30,
        generates: { food: 5 }
    }, {
        // level 3:
        workerCapacity: 10,
        cost: 50,
        generates: { food: 7 }
    }]
}

export default {
    lumberMill,
    farm
}

// export const ironMine:ResourceStructureDefinition = {
//     displayName: "Marvins farm",
// }

