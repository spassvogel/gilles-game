import { type ResourceStructureDefinition, StructureType } from './types'
import { HALF_HOUR, ONE_MINUTE, TWO_MINUTES } from 'utils/format/time'

const lumberMill: ResourceStructureDefinition = {
  type: StructureType.resource,
  cost: {
    gold: 30,
    time: HALF_HOUR
  },
  levels: [{
    // level 0:
    displayName: 'structure-lumber-mill-name',
    workerCapacity: 2,
    cost: {
      gold: 0
    },
    generates: { wood: 2 }
  }, {
    // level 1:
    displayName: 'structure-lumber-mill-name',
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
    generates: { wood: 2 }
  }, {
    // level 2:
    displayName: 'structure-lumber-mill-name',
    workerCapacity: 10,
    cost: {
      gold: 50,
      time: TWO_MINUTES
    },
    generates: { wood: 2 }
  }]
}

export default lumberMill
