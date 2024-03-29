import { ONE_MINUTE, THREE_MINUTES, TWO_MINUTES } from 'utils/format/time'
import { type ProductionStructureDefinition, StructureType } from './types'

const workshop: ProductionStructureDefinition = {
  type: StructureType.production,
  cost: {
    gold: 40,
    time: 4000
  },
  levels: [{
    // level 1:
    displayName: 'structure-workshop-name',
    workerCapacity: 2,
    cost: {
      gold: 0
    },
    unlocks: []
  }, {
    // level 2:
    displayName: 'structure-workshop-name',
    workerCapacity: 5,
    cost: {
      gold: 30,
      resources: {
        wood: 100,
        iron: 100,
        stone: 100
      },
      time: ONE_MINUTE
    },
    unlocks: []
  }, {
    // level 3:
    displayName: 'structure-workshop-name',
    workerCapacity: 10,
    cost: {
      gold: 50,
      time: TWO_MINUTES
    },
    unlocks: []
  }, {
    // level 4:
    displayName: 'structure-workshop-name',
    workerCapacity: 14,
    cost: {
      gold: 50,
      time: THREE_MINUTES
    },
    unlocks: []
  }]
}
export default workshop
