import { type Dispatch } from 'redux'
import { type TaskStoreState, TaskType } from 'store/types/task'
import { type TasksStoreState } from 'store/types/tasks'
import { ToastEmitter } from 'emitters/ToastEmitter'
import * as TextManager from 'global/TextManager'
import { Type } from 'components/ui/toasts/Toast'
import { getDefinition } from 'definitions/items'
import { type ItemType } from 'definitions/items/types'
import { type Action } from 'store/actions'
import { type Structure } from 'definitions/structures'
import { getStructureIcon } from 'components/town/StructureLabels/utils/getStructureIcon'
import { addLogText } from 'store/actions/log'
import { LogChannel } from 'store/types/logEntry'

export const processCompletedTasks = (tasks: TasksStoreState, dispatch: Dispatch<Action>) => {
  const handleCompletedTask = (task: TaskStoreState) => {
    // Fire all callbacks
    task.callbacks.forEach((action) => dispatch(action))

    switch (task.type) {
      case TaskType.craftItem: {
        const type = task.name as ItemType
        const item = { type }
        const title = TextManager.get('common-item-crafted', { item })
        const definition = getDefinition(type)

        ToastEmitter.addToast(title, Type.itemCrafted, definition.iconImg)
        dispatch(addLogText('common-item-crafted', { item }))
        break
      }

      case TaskType.buildStructure: {
        const structure = task.name.replace('.build', '') as Structure
        const title = TextManager.get('common-structure-built', { structure })
        const icon = getStructureIcon(structure)

        ToastEmitter.addToast(title, Type.structureBuilt, icon)
        dispatch(addLogText('common-structure-built', { structure }), LogChannel.town)
        break
      }
    }
  }

  tasks.completed.forEach((task) => { handleCompletedTask(task) })
}
