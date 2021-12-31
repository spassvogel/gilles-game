import { useDispatch } from "react-redux";
import { AdventurerStoreState } from "store/types/adventurer";
import { DraggableInfoWindow } from "components/ui/modals/InfoWindow/DraggableInfoWindow";
import { useAdventurerState } from "hooks/store/adventurers";
import { useContext, useMemo } from "react";
import { SceneControllerContext } from "components/world/QuestPanel/context/SceneControllerContext";
import { adventurerWeapons } from "store/helpers/storeHelpers";
import { getDefinition as getWeaponDefinition, WeaponTypeDefinition, Weapon, WeaponAbility } from 'definitions/items/weapons';
import { Item } from "definitions/items/types";
import { TextManager } from "global/TextManager";
import { isEnemy } from "store/types/scene";
import { ActionIntent } from "../SceneUI";
import WeaponActionButton from "./ActionButton";
import ActionButton from "./ActionButton";
// import "./styles/debugAdventurerEdit.scss";

type Props = {
  adventurerId: string;
  location: [number, number];
  onClose: () => void;
  onSetActionIntent: (intent?: ActionIntent) => void;
}

export type WeaponWithAbility = {
  weapon: Item<Weapon>
  ability: WeaponAbility
}

const ActionMenu = (props: Props) => {
  const { adventurerId, location, onClose, onSetActionIntent } = props;
  const adventurer: AdventurerStoreState = useAdventurerState(adventurerId);
  const controller = useContext(SceneControllerContext);
  const weapons = adventurerWeapons(adventurer);
  if (!controller) throw new Error("No controller");

  const enemyTargetted = useMemo(() => {
    return controller?.getObjectAtLocation(location, isEnemy);
  }, [controller, location]);

  const weaponActions = useMemo(() => {
    const result: WeaponWithAbility[] = [];
    weapons?.forEach((weapon) => {
      if (!weapon) return;
      const definition = getWeaponDefinition(weapon.type);
      const weaponType = WeaponTypeDefinition[definition.weaponType];
      weaponType.abilities.forEach((ability) => {
        result.push({ weapon, ability })
      })
    })
    return result;
  }, [weapons]);


  return (
    <div className="action-menu">
      <DraggableInfoWindow className="debug-adventurer-edit action-menu-modal" title="Action" onClose={onClose}>
        {adventurer.name}
        <ul>
          {enemyTargetted && weaponActions.map((wWA, i) => (
            <li key={`${wWA.ability}${wWA.weapon.type}${i}`}>
              <ActionButton
                adventurer={adventurer}
                location={location}
                onSetActionIntent={onSetActionIntent}
                renderText={(intent) => (
                  <>
                  {TextManager.getItemName(wWA.weapon)}
                  -
                  {WeaponAbility[wWA.ability]}
                  {intent &&
                    JSON.stringify(intent?.apCost)
                  }
                  </>
                )}
              />
            </li>
          ))}
          {!enemyTargetted && (
            <ActionButton
              adventurer={adventurer}
              location={location}
              onSetActionIntent={onSetActionIntent}
              renderText={(intent) => "Move " + intent?.apCost}
            />
          )}
        </ul>
        <div>
          {enemyTargetted?.name && TextManager.getEnemyName(enemyTargetted.name)}
        </div>
      </DraggableInfoWindow>
    </div>
  )
}

export default ActionMenu;

