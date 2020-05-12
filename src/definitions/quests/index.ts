import kill10Boars from './kill10Boars';
import retrieveMagicAmulet from './retrieveMagicAmulet';
import { QuestDefinition } from './types';

// tslint:disable:object-literal-sort-keys





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

export function getDefinition<T>(quest: string): QuestDefinition<T> {
    return all[quest];
}
