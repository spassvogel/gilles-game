import kill10Boars from './kill10Boars';
import retrieveMagicAmulet from './retrieveMagicAmulet';
import { QuestDefinition } from './types';




// const fulruhmRaid: QuestDefinition = {
//     nodes: [{
//         x: -4,
//         y: -1,
//         type: QuestNodeType.nothing,
//     }, {
//         x: -4,
//         y: -1,
//         type: QuestNodeType.nothing,

const all = {
    kill10Boars,
    retrieveMagicAmulet,
};

export default all;

export function getDefinition<T = unknown>(questName: string): QuestDefinition<T> {
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return all[questName];
}
