import { StructureType, ResourceStructureDefinition } from './types';

const farm:ResourceStructureDefinition = {
    type: StructureType.resource,
    levels: [{
        displayName: "Dirt Farm",
        // level 1:
        workerCapacity: 2,
        generates: { food: 2 }
    }, {
        displayName: "Farm",
        // level 2:
        workerCapacity: 5,
        cost: 30,
        generates: { food: 2 }
    }, {
        // level 3:
        displayName: "Greenhouse",
        workerCapacity: 10,
        cost: 50,
        generates: { food: 2 }
    }]
}

export default farm;