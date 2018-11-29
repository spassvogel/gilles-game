import { ResourceStoreState } from 'src/stores/resources';
import * as time from 'src/utils/time';

export enum Structure {
    lumberMill = "lumberMill",
    ironMine = "ironMine",
    farm = "farm",
    tannery = "tannery",
    blacksmith = "blacksmith"
}

export enum StructureType {
    resource,
    production
}

export interface StructureDefinition {
    type: StructureType
}

interface StructureLevelDefinition {
    displayName: string
    cost?: number                // in gold
    workerCapacity: number       // number of workers that can work at this structure at this level
}

export interface ResourceStructureDefinition extends StructureDefinition {
    levels: (ResourceStructureLevelDefinition)[]
}

export interface ResourceStructureLevelDefinition extends StructureLevelDefinition {
    generates: ResourceStoreState,
}

export interface ProductionStructureDefinition extends StructureDefinition {
    levels: ProductionStructureLevelDefinition[]
}

export interface ProductionStructureLevelDefinition extends StructureLevelDefinition {
    produces: ProductionDefinition[],
}

export interface ProductionDefinition {
    equipment:string,
    cost:ResourceStoreState
    time:number
}


const lumberMill:ResourceStructureDefinition = {
    type: StructureType.resource,
    levels: [{
        // level 0:
        displayName: "Ye olde lumber mill",
        workerCapacity: 2,
        generates: { wood: 2 }
    }, {
        // level 1:
        displayName: "Slightly less olde lumber mill",
        workerCapacity: 5,
        cost: 30,
        generates: { wood: 2 }
    }, {
        // level 2:
        displayName: "State of the art wood processing plant",
        workerCapacity: 10,
        cost: 50,
        generates: { wood: 2 }
    }]
}

const ironMine:ResourceStructureDefinition = {
    type: StructureType.resource,
    levels: [{
        displayName: "Hole in the rocky ground",
        // level 0:
        workerCapacity: 2,
        generates: { iron: 2 }
    }, {
        displayName: "A small mine",
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { iron: 2 }
    }, {
        displayName: "A large mine",
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { iron: 2 }
    }]
}

const farm:ResourceStructureDefinition = {
    type: StructureType.resource,
    levels: [{
        displayName: "A small farm",
        // level 1:
        workerCapacity: 2,
        generates: { food: 2 }
    }, {
        displayName: "Mid-sized farm",
        // level 2:
        workerCapacity: 5,
        cost: 30,
        generates: { food: 2 }
    }, {
        // level 3:
        displayName: "Global agricultural conglomeration",
        workerCapacity: 10,
        cost: 50,
        generates: { food: 2 }
    }]
}

const tannery:ResourceStructureDefinition = {
    type: StructureType.resource,
    levels: [{
        displayName: "Small tannery",
        // level 1:
        workerCapacity: 2,
        generates: { leather: 2 }
    }, {
        // level 2:
        displayName: "Bigger tannery",
        workerCapacity: 5,
        cost: 30,
        generates: { leather: 5 }
    }, {
        // level 3:
        displayName: "Huge tannery",
        workerCapacity: 10,
        cost: 50,
        generates: { leather: 7 }
    }]
}

const crossbow: ProductionDefinition = {
    equipment: "crossbow",
    cost: { wood: 20, iron: 5 },
    time: time.ONE_MINUTE
}
const longbow: ProductionDefinition = {
    equipment: "longbow",
    cost: { wood: 40, iron: 5},
    time: time.TWO_MINUTES
}
const dagger: ProductionDefinition = {
    equipment: "dagger",
    cost: { wood: 10, iron: 10},
    time: time.ONE_MINUTE
}
const sword: ProductionDefinition = {
    equipment: "sword",
    cost: { wood: 10, iron: 30},
    time: time.TWO_MINUTES
}


const blacksmith:ProductionStructureDefinition = {
    type: StructureType.production,
    displayName: "The blacksmith",
    levels: [{
        // level 1:
        workerCapacity: 2,
        produces: [crossbow, dagger]
    }, {
        // level 2:
        workerCapacity: 5,
        cost: 30,
        produces: [crossbow, dagger, longbow]
    }, {
        // level 3:
        workerCapacity: 10,
        cost: 50,
        produces: [crossbow, dagger, longbow, sword]
    }]
}
export default {
    lumberMill,
    ironMine,
    farm,
    tannery,
    blacksmith
};

