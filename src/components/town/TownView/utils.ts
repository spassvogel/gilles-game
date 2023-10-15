import { type Structure } from 'definitions/structures'
import LumberMill from '../structures/LumberMill'
import Tavern from '../structures/Tavern'
import Generic from '../structures/Generic'
import { Point } from 'pixi.js'

export const getStructure = (structure: Structure) => {
  switch (structure) {
    case 'workshop':
    case 'quarry':
    case 'tannery':
    case 'alchemist':
    case 'garden':
    case 'weaponsmith':
    case 'armoursmith':
    case 'warehouse':
    case 'mine':
    case 'weaver':
      return Generic
    case 'lumberMill':
      return LumberMill
    case 'tavern':
      return Tavern
  }
}

export const getStructurePosition = (structure: Structure) => {
  let x
  let y
  switch (structure) {
    case 'workshop':
      x = 373
      y = 610
      break
    case 'quarry':
      x = 632
      y = 633
      break
    case 'tannery':
      x = 372
      y = 460
      break
    case 'tavern':
      x = 500
      y = 469
      break
    case 'alchemist':
      x = 411
      y = 371
      break
    case 'garden':
      x = 822
      y = 689
      break
    case 'weaponsmith':
      x = 449
      y = 460
      break
    case 'armoursmith':
      x = 473
      y = 442
      break
    case 'warehouse':
      x = 471
      y = 130
      break
    case 'lumberMill':
      x = 403
      y = 320
      break
    case 'mine':
      x = 183
      y = 527
      break
    case 'weaver':
      x = 484
      y = 333
      break
  }
  return new Point(x, y)
}
