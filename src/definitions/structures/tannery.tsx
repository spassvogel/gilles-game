import { ResourceStructureDefinition, StructureType } from "./types";

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

export default tannery;