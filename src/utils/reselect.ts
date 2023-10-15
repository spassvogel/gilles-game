import { createSelectorCreator, defaultMemoize } from 'reselect'
import stringArrayEqual from 'string-arrays-equal'

export const createStringArraySelector = createSelectorCreator(
  defaultMemoize,
  stringArrayEqual
)
