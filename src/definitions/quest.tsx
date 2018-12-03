import { ResourceStoreState } from 'src/stores/resources';

export enum QuestNodeType {
    nothing = 0,    // Nothing much going on here
    encounter = 1,
    combat = 2,
    boss = 3
}

interface QuestDefinition {
    displayName:string
    nodes:QuestNode[]
    //type: StructureType
}

interface QuestNode {
    x:number,
    y:number,
    type:QuestNodeType
    encounter?:any
}

const quest1:QuestDefinition = {
    displayName: "Kill 10 boars",
    nodes: [{
        x: 0,
        y: 1,
        type: QuestNodeType.encounter
    }]
}

export default {
    quest1
}
