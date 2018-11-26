import { ResourceStoreState } from 'src/stores/resources';

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
    displayName: string
    type: StructureType
}

interface StructureLevelDefinition {
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
    equipment: string,
    cost: ResourceStoreState
}


const lumberMill:ResourceStructureDefinition = {
    type: StructureType.resource,
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

const ironMine:ResourceStructureDefinition = {
    type: StructureType.resource,
    displayName: "The iron mine",
    levels: [{
        // level 0:
        workerCapacity: 2,
        generates: { iron: 2 }
    }, {
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { iron: 2 }
    }, {
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { iron: 2 }
    }]
}

const farm:ResourceStructureDefinition = {
    type: StructureType.resource,
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
    type: StructureType.resource,
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

const crossbow: ProductionDefinition = {
    equipment: "crossbow",
    cost: { wood: 20, iron: 5}
}
const longbow: ProductionDefinition = {
    equipment: "longbow",
    cost: { wood: 40, iron: 5}
}

const blacksmith:ProductionStructureDefinition = {
    type: StructureType.production,
    displayName: "The blacksmith",
    levels: [{
        // level 1:
        workerCapacity: 2,
        produces: [crossbow]
    }, {
        // level 2:
        workerCapacity: 5,
        cost: 30,
        produces: [crossbow, longbow]
    }, {
        // level 3:
        workerCapacity: 10,
        cost: 50,
        produces: [crossbow, longbow]
    }]
}
export default {
    lumberMill,
    ironMine,
    farm,
    tannery,
    blacksmith
};

