import { TaskStoreState } from "./task";

export interface TasksStoreState {
    running: TaskStoreState[];
    completed: TaskStoreState[];
}
export const initialState: TasksStoreState = {
    completed: [],
    running: [],
};
