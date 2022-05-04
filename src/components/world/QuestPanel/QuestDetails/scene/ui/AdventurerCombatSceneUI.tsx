import CombatUIWidget from './CombatUIWidget';
import ActionMenu from './ActionMenu/ActionMenu';
import useActionIntents from './hooks/useActionIntents';
import { Location } from 'utils/tilemap';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { ActionIntent } from './SceneUI';

type Props = {
  selectedAdventurerId: string;
  cursorLocation: Location;
  visible: boolean;
  setCursorLocation: (location?: Location) => void;
  onSetActionIntent: (intent?: ActionIntent) => void;
};

export type Refs = {
  actionMenuOpen: boolean;
  onMouseUp: () => void;
};

// part of the UI that is shown when an adventurer is selected and the scene is in combat
const AdventurerCombatSceneUI = forwardRef<Refs, Props>((props: Props, ref) => {
// const AdventurerCombatSceneUI = (props: Props) => {
  const { selectedAdventurerId, cursorLocation, visible, setCursorLocation, onSetActionIntent } = props;
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const combatIntents = useActionIntents(selectedAdventurerId, cursorLocation);

  const handleCloseActionMenu = () => {
    setActionMenuOpen(false);
    setCursorLocation(undefined);
  };

  const onMouseUp = useCallback(() => {
    // open action
    const hasValidIntents = !!combatIntents.length && combatIntents.some(i => i.isValid);
    if (cursorLocation && hasValidIntents){
      setActionMenuOpen(true);
    } else {
      setCursorLocation(undefined);
      setActionMenuOpen(false);
    }

    onSetActionIntent?.(undefined);
  }, [combatIntents, cursorLocation, onSetActionIntent, setCursorLocation]);

  useImperativeHandle(ref, () => {
    return {
      actionMenuOpen,
      onMouseUp,
    };
  });

  return (
    <>
      { visible && <CombatUIWidget
        location={cursorLocation}
        intents={combatIntents}
        selectedActorId={selectedAdventurerId}
      />}
      { (actionMenuOpen && cursorLocation && combatIntents) && (
        <ActionMenu
          adventurerId={selectedAdventurerId}
          location={cursorLocation}
          intents={combatIntents}
          onClose={handleCloseActionMenu}
          onSetActionIntent={onSetActionIntent}
        />
      )}
    </>
  );
});
AdventurerCombatSceneUI.displayName = 'AdventurerCombatSceneUI';
export default AdventurerCombatSceneUI;
