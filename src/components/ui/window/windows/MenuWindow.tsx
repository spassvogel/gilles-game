import { Props as WindowProps } from "components/ui/window/Window";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import SettingsWindow from './SettingsWindow';
import CheatWindow from './CheatWindow';
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import Button from 'components/ui/buttons/Button';
import GameStats from "components/ui/game/GameStats";
import SaveAndLoadWindow from "./SaveAndLoadWindow";
import "./styles/menu.scss";


type AllProps = WindowProps;
const Menu = (props: AllProps & AppContextProps) => {

  const storeState = useSelector<StoreState, StoreState>(state => state);

  const handleClickCheats = () => {
    const window = <CheatWindow title="Cheats" />;
    props.onOpenWindow(window);
  };

  const handleClickSettings = () => {
    const window = <SettingsWindow title="Settings" />;
    props.onOpenWindow(window);
  };

  const handleClickSaveAndLoad = () => {
    const window = <SaveAndLoadWindow title="Save and Load" />;
    props.onOpenWindow(window);
  }

  return (
    <div className="menu">
      <p>
        <Button onClick={handleClickSaveAndLoad}>Save and load</Button>
      </p>
      <p>
        <Button onClick={handleClickCheats}>Cheats!</Button>
      </p>
      <p>
        <Button onClick={handleClickSettings}>Settings</Button>
      </p>
      <div>
        <GameStats state={storeState} />
      </div>
    </div>
  );
}

export default compose(
  withWindow,
  withAppContext,
)(Menu) as React.ComponentType<AllProps>;
