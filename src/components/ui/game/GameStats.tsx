// Displays various game stats
import { Resource } from 'definitions/resources';
import { Structure } from 'definitions/structures';
import { TextManager } from 'global/TextManager';
import { Fragment, useMemo } from 'react';
import { groupAdventurersByQuest } from 'store/selectors/adventurers';
import { StoreState } from 'store/types';
import { QuestStatus } from 'store/types/quest';
import { StructureState } from 'store/types/structure';
import { formatDuration } from 'utils/format/time';
import { convertIntToSemVer } from 'utils/version';
import * as Version from 'constants/version';
import './styles/gameStats.scss';

type Props = {
  state: StoreState
};

const GameStats = (props: Props) => {
  const { state } = props;
  const timePlaying = formatDuration(state.engine.lastTick - (state.engine.gameStarted ?? 0), true);
  const groupedAdventurers = groupAdventurersByQuest(state.adventurers, state.quests);
  const version = useMemo(() => {
    if (!state.game?.version) return 'unknown';
    if (state.game.version === Version.asInt) {
      return convertIntToSemVer(state.game.version);
    }
    return (
      <>
        <span className="invalid">{convertIntToSemVer(state.game.version)}</span>
        <span className="prop"> (current: </span>
        <span>{convertIntToSemVer(Version.asInt)}</span>
        <span className="prop">) </span>
      </>
    );
  }, [state.game.version]);

  return (
    <div className="game-stats">
      <div className="column">
        <fieldset>
          <legend>General</legend>
          <dl>
            <dt>Time playing</dt>
            <dd>{timePlaying}</dd>
            <dt>Version</dt>
            <dd>{version}</dd>
            <dt>Quests active</dt>
            <dd>{state.quests.filter(q => q.status === QuestStatus.active).length}</dd>
            <dt>Quests completed</dt>
            <dd>{state.quests.filter(q => q.status === QuestStatus.completed).length}</dd>
          </dl>
        </fieldset>
        <fieldset>
          <legend>Structures</legend>
          <dl>
            {Object.keys(state.structures).map(key => {
              const structure = key as Structure;
              if (state.structures[structure].state === StructureState.Built) {
                return (
                  <Fragment key={structure}>
                    <dt>{TextManager.getStructureName(structure)}</dt>
                    <dd>{TextManager.get('ui-structure-level')} {state.structures[structure].level + 1}</dd>
                  </Fragment>
                );
              }
              if (state.structures[structure].state === StructureState.Building) {
                return (
                  <Fragment key={structure}>
                    <dt>{TextManager.getStructureName(structure)}</dt>
                    <dd>constructing...</dd>
                  </Fragment>
                );
              }
              return null;
            })}
          </dl>
        </fieldset>
      </div>
      <div className="column">
        <fieldset>
          <legend>Resources</legend>
          <dl>
            {Object.keys(state.resources).map(key => {
              const resource = key as Resource;
              return (
                <Fragment key={resource}>
                  <dt>{TextManager.getResourceName(resource)}</dt>
                  <dd>{state.resources[resource]}</dd>
                </Fragment>
              );
            })}
            <dt>{TextManager.get('resource-gold-name')}</dt>
            <dd>{state.gold}</dd>
            <dt>{TextManager.get('resource-workers-name')}</dt>
            <dd>{state.workers}</dd>
          </dl>
        </fieldset>
        <fieldset>
          <legend>Adventurers</legend>
          <dl>
            <dt>In tavern</dt>
            <dd>{groupedAdventurers.solo.length}</dd>
            <dt>On quest</dt>
            <dd>{state.adventurers.length - groupedAdventurers.solo.length}</dd>
          </dl>
        </fieldset>
      </div>
    </div>
  );
};

export default GameStats;
