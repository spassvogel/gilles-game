import { ResourceStoreState } from 'src/stores/resources';

export enum EquipmentType {
    lumberMill = "lumberMill",
    farm = "farm",
    tannery = "tannery"
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
    displayName: "The lumber mill",
    levels: [{
        // level 0:
        workerCapacity: 2,
        generates: { wood: 2 }
    }, {
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { wood: 2 }
    }, {
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { wood: 2 }
    }]
}

const farm:ResourceStructureDefinition = {
    displayName: "The farm",
    levels: [{
        // level 1:
        workerCapacity: 2,
        generates: { food: 2 }
    }, {
        // level 2:
        workerCapacity: 5,
        cost: 30,
        generates: { food: 2 }
    }, {
        // level 3:
        workerCapacity: 10,
        cost: 50,
        generates: { food: 2 }
    }]
}

const tannery:ResourceStructureDefinition = {
    displayName: "The tannery",
    levels: [{
        // level 1:
        workerCapacity: 2,
        generates: { leather: 2 }
    }, {
        // level 2:
        workerCapacity: 5,
        cost: 30,
        generates: { leather: 5 }
    }, {
        // level 3:
        workerCapacity: 10,
        cost: 50,
        generates: { leather: 7 }
    }]
}

export default {
    lumberMill,
    farm,
    tannery
}

// export const ironMine:ResourceStructureDefinition = {
//     displayName: "Marvins farm",
// }

