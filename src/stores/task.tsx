import { AnyAction } from "redux";

export enum TaskType {
    constructEquipment,
}

export interface TaskStoreState {
    type: TaskType;
    name: string;
    origin: string;
    startTime: number;        // time the task was scheduled
    lastTick: number;         // time of last tick
    timeRemaining: number;
    progress: number;         // value between 0 and 1 indicating progress
    callback: AnyAction;		// action to dispatch on complete
}
