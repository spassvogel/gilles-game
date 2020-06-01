import { TaskStoreState, TaskType } from 'stores/task';
import { TasksStoreState } from 'stores/tasks';
import { AnyAction, Dispatch } from "redux";
import { ToastManager } from 'global/ToastManager';
import { TextManager } from 'global/TextManager';
import { Type } from 'components/ui/toasts/Toast';
import { getDefinition } from 'definitions/items';
import { Item } from 'definitions/items/types';

export const processCompletedTasks = (tasks: TasksStoreState, dispatch: Dispatch<AnyAction>) => {
    const handleCompletedTask = (task: TaskStoreState) => {
        // Fire all callbacks
        task.callbacks.forEach((action) => dispatch(action));

        switch (task.type) {
            case TaskType.craftItem:
                const item = task.name as Item;
                const title = TextManager.get("common-item-crafted", { item });
                const definition = getDefinition(item);
                ToastManager.addToast(title, Type.itemCrafted, definition.iconImg);
                break;
        }
    };

    tasks.completed.forEach((task) => handleCompletedTask(task));
};