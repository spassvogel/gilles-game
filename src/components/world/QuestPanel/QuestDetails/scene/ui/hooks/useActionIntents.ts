import { useContext, useMemo } from "react";
import { Location } from 'utils/tilemap';
import { AdventurerStoreState } from "store/types/adventurer";
import { useAdventurerState } from "hooks/store/adventurers";
import { SceneControllerContext } from "components/world/QuestPanel/context/SceneControllerContext";
import { adventurerWeapons } from "store/helpers/storeHelpers";
import { getDefinition as getWeaponDefinition, WeaponTypeDefinition, WeaponClassification } from 'definitions/items/weapons';
import { isEnemy, SceneActionType } from "store/types/scene";
import { ActionIntent } from "../SceneUI";

const useActionIntents = (adventurerId: string, location?: Location, combat = false ) => {
  const adventurer: AdventurerStoreState = useAdventurerState(adventurerId);
  const weapons = adventurerWeapons(adventurer);
  const controller = useContext(SceneControllerContext);
  if (!controller) throw new Error("No controller");

  // const enemyTargetted = useMemo(() => {
  //   if (!location) return undefined;
  //   return controller?.getObjectAtLocation(location, isEnemy);
  // }, [controller, location]);


  const actorObject = controller?.getSceneActor(adventurer.id);

  const weaponIntents = useMemo(() => {
    if (!combat || !actorObject || !location) return [];
    const result: ActionIntent[] = [];
    weapons?.forEach((weapon) => {
      if (!weapon) return;
      const definition = getWeaponDefinition(weapon.type);
      const weaponType = WeaponTypeDefinition[definition.weaponType];
      const { classification } = WeaponTypeDefinition[definition.weaponType];
      weaponType.abilities.forEach((ability) => {
        const weaponWithAbility = { weapon, ability };

        // Ranged weapons trigger a 'shoot' action, others a melee
        const action = classification === WeaponClassification.ranged ? SceneActionType.shoot : SceneActionType.melee;

        const intent = controller?.createActionIntent(action, actorObject, location);
        if (intent) { // TODO: and enough AP
          result.push({
            ...intent,
            action,
            weaponWithAbility
          })
        }
      })
    })
    return result;
  }, [actorObject, combat, controller, location, weapons]);

  const moveIntent = useMemo(() => {
    if (!actorObject || !location) return
    return controller?.createActionIntent(SceneActionType.move, actorObject, location)
  }, [actorObject, controller, location])

  return useMemo(() => {
    return [
      ...weaponIntents,
      ...(moveIntent ? [moveIntent] : [])
    ]
  }, [moveIntent, weaponIntents])
}

export default useActionIntents;
