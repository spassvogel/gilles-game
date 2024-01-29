import { createSelectorCreator, lruMemoize } from 'reselect'
import stringArrayEqual from 'string-arrays-equal'

export const createStringArraySelector = createSelectorCreator(
  lruMemoize,
  stringArrayEqual
)
