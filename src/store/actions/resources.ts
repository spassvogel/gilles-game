import { ResourceStoreState } from "store/types/resources";

export type ResourcesAction = 
    { type: "addResources", resources: ResourceStoreState }
 |  { type: "removeResources", resources: ResourceStoreState }


export const addResource = (resource: string, value: number): ResourcesAction => {
    return addResources({
        [resource]: value,
    });
}

export const addResources = (resources: ResourceStoreState): ResourcesAction => ({
    type: "addResources",
    resources,
})

export const removeResources = (resources: ResourceStoreState): ResourcesAction => ({
    type: "removeResources",
    resources,
})
