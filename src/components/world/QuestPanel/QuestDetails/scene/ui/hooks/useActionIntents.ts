import { useContext, useMemo } from 'react'
import { type Location } from 'utils/tilemap'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { useAdventurer } from 'hooks/store/adventurers'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { adventurerAmmo, adventurerWeapons } from 'store/helpers/storeHelpers'
import { getDefinition as getWeaponDefinition } from 'definitions/items/weapons'
import { SceneActionType } from 'store/types/scene'
import { type WeaponWithAbility, type ActionIntent } from '../SceneUI'
import { getDefinition as getWeaponTypeDefinition } from 'definitions/weaponTypes'
import { WeaponClassification } from 'definitions/weaponTypes/types'
import { getDefinition as getAbilityDefinition } from 'definitions/abilities'

const useActionIntents = (adventurerId: string, location?: Location) => {
  const adventurer: AdventurerStoreState = useAdventurer(adventurerId)
  const weapons = adventurerWeapons(adventurer)
  const controller = useContext(SceneControllerContext)
  if (controller == null) throw new Error('No controller')

  // const enemyTargetted = useMemo(() => {
  //   if (!location) return undefined
  //   return controller?.getObjectAtLocation(location, isEnemy)
  // }, [controller, location])

  const actorObject = controller?.getSceneAdventurer(adventurer.id)

  const weaponIntents = useMemo(() => {
    if ((actorObject == null) || (location == null)) return []
    const result: ActionIntent[] = []
    weapons?.forEach((weapon) => {
      if (weapon == null) return
      const definition = getWeaponDefinition(weapon.type)
      const weaponType = getWeaponTypeDefinition(definition.weaponType)
      const { classification } = weaponType
      weaponType.abilities.forEach((ability) => {
        const abilityDefinition = getAbilityDefinition(ability)
        if (abilityDefinition.passive === true) return
        const weaponWithAbility: WeaponWithAbility = { weapon, ability }

        // Ranged weapons trigger a 'shoot' action, others a melee
        const action = classification === WeaponClassification.ranged ? SceneActionType.shoot : SceneActionType.melee
        if (action === SceneActionType.melee) {
          const intent = controller?.createActionIntent(action, actorObject, location, weaponWithAbility)
          if (intent != null) { // TODO: and enough AP
            result.push(intent)
          }
        } else {
          const ammo = adventurerAmmo(adventurer)
          if (ammo == null) throw new Error('no ammo')
          const intent = controller?.createActionIntent(action, actorObject, location, weaponWithAbility, ammo)
          if (intent != null) { // TODO: and enough AP
            result.push(intent)
          }
        }
      })
    })
    return result
  }, [actorObject, adventurer, controller, location, weapons])

  const moveIntent = useMemo(() => {
    if ((actorObject == null) || (location == null)) return
    return controller?.createActionIntent(SceneActionType.move, actorObject, location)
  }, [actorObject, controller, location])

  return useMemo(() => {
    return [
      ...weaponIntents,
      ...((moveIntent != null) ? [moveIntent] : [])
    ]
  }, [moveIntent, weaponIntents])
}

export default useActionIntents
