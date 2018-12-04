import { StructureType, ProductionStructureDefinition } from './types';

const armoursmith:ProductionStructureDefinition = {
    type: StructureType.production,
    levels: [{
        // level 1:
        displayName: "Armoursmith",
        workerCapacity: 2,
        produces: []
    }, {
        // level 2:
        displayName: "Armoursmith",
        workerCapacity: 5,
        cost: 30,
        produces: []
    }, {
        // level 3:
        displayName: "Armoursmith",
        workerCapacity: 10,
        cost: 50,
        produces: []
    }]
}
export default armoursmith;