import { type LootCache } from 'store/types/scene'

export type Kill10BoarsQuestVars = {
  dungeon: {
    entered: boolean
    entrance: {
      chestOpen: boolean
      chest: LootCache
    }
    hallway: {
      doorOpen: boolean
      chestOpen: boolean
      chest: LootCache
    }
    // situations: {
    //   altar: {
    //     candleLit: boolean
    //   },
    // }
  }
}

export const initialQuestVars: Kill10BoarsQuestVars = {
  dungeon: {
    entered: false,
    entrance: {
      chestOpen: false,
      chest: {
        title: 'encounter-dungeon-caches-chest',
        items: [
          { type: 'apparel/nomadHelmet' },
          { type: 'questItem/teeth' },
          { type: 'material/poisonVial' },
          { type: 'apparel/fedora' }
        ],
        gold: 100
      }
      // altar: {
      //   title: "quest-kill10-boars-dungeonentrance-altar",
      //   items: [
      //     Item.bolts,
      //     Item.letters
      //   ]
      // },
    },
    hallway: {
      chest: {
        title: 'encounter-dungeon-caches-chest',
        items: [{ type: 'questItem/key' }]
      },
      chestOpen: false,
      doorOpen: false
    }
  }
}
