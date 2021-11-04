import { AnyAction } from "redux";
import { TaskType } from "store/types/task";


export type TaskAction = {
  type: "start",
  taskType: TaskType;
  name: string;
  origin: string;
  time: number;
  callbacks: AnyAction[];
}

export function startTask(taskType: TaskType, name: string, origin: string, time: number, callbacks: AnyAction[]): TaskAction {
  return {
    type: "start",
    taskType,
    name,
    origin,
    time,
    callbacks,
  };
}
