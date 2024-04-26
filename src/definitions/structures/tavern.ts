import { HALF_HOUR, ONE_MINUTE, TWO_MINUTES } from 'utils/format/time'
import { StructureType, type TavernStructureDefinition } from './types'

const tavern: TavernStructureDefinition = {
  cost: {
    gold: 40,
    time: HALF_HOUR * 1.5,
    resources: {
      wood: 50
    }
  },
  type: StructureType.tavern,
  levels: [{
    displayName: 'structure-tavern-name',
    // level 1:
    workerCapacity: 2,
    cost: {
      gold: 0
    },
    waitingAdventurers: 2,
    rooms: 10
  }, {
    // level 2:
    displayName: 'structure-tavern-name',
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
    waitingAdventurers: 2,
    rooms: 12
  }, {
    // level 3:
    displayName: 'structure-tavern-name',
    workerCapacity: 10,
    cost: {
      gold: 50,
      time: TWO_MINUTES
    },
    waitingAdventurers: 3,
    rooms: 15
  }]
}

export default tavern
