import { type QuestItem } from 'definitions/items/questItems'
import * as time from 'utils/format/time'
import { type ProductionDefinition } from './types'

const workshopProduction: { [key in QuestItem]?: ProductionDefinition } = {
  'questItem/torch': {
    item: { type: 'questItem/torch' },
    cost: {
      resources: { wood: 2, fabric: 1 },
      time: time.ONE_MINUTE
    }
  },
  'questItem/sandwich': {
    item: { type: 'questItem/sandwich' },
    cost: {
      resources: { food: 1 },
      time: time.ONE_MINUTE / 2
    }
  }
}
export default workshopProduction
