import { createContext } from 'react';

export type GameActionsContextProps = {
  pauseGame: () => void,
  continueGame: () => void,
  restartGame: () => void,
};

const emptyFn = () => undefined;

export const GameActionsContext = createContext<GameActionsContextProps>({
  // values will all be overwritten in Game
  pauseGame: emptyFn,
  continueGame: emptyFn,
  restartGame: emptyFn,
});
