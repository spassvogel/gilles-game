import { AdventurerStoreState } from "store/types/adventurer";
import { ReactNode, useCallback, useContext, useEffect } from "react";
import { SceneControllerContext } from "components/world/QuestPanel/context/SceneControllerContext";
import Button from "components/ui/buttons/Button";
import { ActionIntent } from "../SceneUI";
import { locationEquals } from "utils/tilemap";
// import "./styles/debugAdventurerEdit.scss";

type Props = {
  adventurer: AdventurerStoreState;
  location: [number, number];
  intent: ActionIntent;
  renderText: (intent: ActionIntent) => ReactNode;
  onSetActionIntent: (intent?: ActionIntent) => void;
  onCloseMenu: () => void;
}

const ActionButton = (props: Props) => {
  const {
    adventurer,
    location,
    intent,
    renderText,
    onSetActionIntent,
    onCloseMenu,
  } = props;
  const controller = useContext(SceneControllerContext);
  if (!controller) throw new Error("No controller");


  // Released the mouse outside of th
  const cancelIntent = useCallback(() => {
    window.removeEventListener("mouseup", cancelIntent)
    onSetActionIntent?.(undefined);
  }, [onSetActionIntent]);

  const handleMouseDown = () => {
    onSetActionIntent?.(intent);
    window.addEventListener("mouseup", cancelIntent);
  }

  const handleMouseUp = () => {
    const selectedActorLocation = controller?.getSceneActor(adventurer.id)?.location;
    if (selectedActorLocation && location && !locationEquals(selectedActorLocation, location) && intent){
      controller?.actorAttemptAction(intent);
      onCloseMenu();
    }

    onSetActionIntent?.(undefined);
  }

  useEffect(() => {
    return () => { window.removeEventListener("mouseup", cancelIntent) }
  }, [cancelIntent])

  return (
    <Button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {renderText(intent)}
    </Button>
  )
}

export default ActionButton;
