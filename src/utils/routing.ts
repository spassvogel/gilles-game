// Utilities for routing 

export const getWorldLink = () => `/world`;
export const getQuestLink = (questName: string) => `${getWorldLink()}/${questName}`;