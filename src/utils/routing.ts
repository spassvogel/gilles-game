// Utilities for routing

import { Structure } from 'definitions/structures';

export const getWorldLink = () => 'world';
export const getQuestLink = (questName: string) => `${getWorldLink()}/${questName}`;

export const getTownLink = () => 'town';
export const getStructureLink = (structure: Structure, onlyHighlight = false) => `/${getTownLink()}/${structure}${onlyHighlight ? '' : '/view'}`;
