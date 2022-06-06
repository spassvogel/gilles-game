import Tab from 'components/ui/tabs/Tab';
import Tabstrip from 'components/ui/tabs/Tabstrip';
import { LogChannel, LogEntry } from 'store/types/logEntry';
import { TextManager } from 'global/TextManager';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Button from 'components/ui/buttons/Button';
import { useLog } from 'hooks/store/useLog';
import { useActiveQuestNames } from 'hooks/store/quests';
import { useLocation } from 'react-router-dom';
import { getQuestLink, getTownLink } from 'utils/routing';
import Markdown from 'components/markdown/Markdown';
import './styles/simplelog.scss';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Props {
}

enum ChannelType {
  all,
  town,
  quest,
}

interface ChannelDefinition {
  label: string;
  tabType: ChannelType;
  tabId: string;
  channelContext?: string;
}

const SimpleLog = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTabId, setSelectedTabId] = useState<'all' | 'town' | string>('all');

  const logEntries = useLog();
  const activeQuestNames = useActiveQuestNames();
  const location = useLocation();
  const scrollDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.pathname === getTownLink()){
      setSelectedTabId('town');
      return;
    }
    activeQuestNames.forEach(q => {
      if (location.pathname === getQuestLink(q)){
        setSelectedTabId(`quest-${q}`);
      }
    });
  }, [activeQuestNames, location]);

  const channels: ChannelDefinition[] = [{
    label: TextManager.get('ui-log-tab-all'),
    tabId: 'all',
    tabType: ChannelType.all,
  }, {
    label: TextManager.get('ui-log-tab-town'),
    tabId: 'town',
    tabType: ChannelType.town,
  }];

  const handleTabSelected = (tabId: string) => {
    setSelectedTabId(tabId);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  activeQuestNames.forEach((questName) => {
    channels.push({
      channelContext: questName,
      label: TextManager.getQuestTitle(questName),
      tabId: `quest-${questName}`,
      tabType: ChannelType.quest,
    });
  });

  const currentTab = channels.find((t) => t.tabId === selectedTabId);
  const displayEntries: LogEntry[] = useMemo(() => {
    switch (currentTab?.tabType) {
      case ChannelType.all:
        // All the things
        return logEntries;

      case ChannelType.town:
        // Only town
        return logEntries.filter((lE) => lE.channel === LogChannel.town);

      case ChannelType.quest:
        // Only the selected quest
        return logEntries.filter((lE) => lE.channel === LogChannel.quest && lE.channelContext === currentTab.channelContext);
    }
    return [];
  }, [currentTab?.channelContext, currentTab?.tabType, logEntries]);

  useEffect(() => {
    if (scrollDownRef.current){
      scrollDownRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [displayEntries]);

  const getLogEntryRow = (logEntry: LogEntry) => {
    const text = TextManager.get(logEntry.key, logEntry.context);

    return (
      <div className="entry" key={logEntry.time}>
        <Markdown>{text}</Markdown>
      </div>
    );
  };

  return (
    <div className={`log${expanded ? ' expanded' : ''}`}>
      <div className="tab-bar">
        <Tabstrip className="tabs" onTabSelected={handleTabSelected} activeTab={selectedTabId}>
          {channels.map((tab) => {
            return <Tab id={tab.tabId} key={tab.tabId}>{tab.label}</Tab>;
          })}
        </Tabstrip>
        <Button
          className="expand-button"
          onClick={handleToggleExpand}
          square={true}
          size="medium"
          text={expanded ? '▼' : '▲'}
        />
      </div>
      <div className="log-entries">
        {displayEntries.map((entry) => getLogEntryRow(entry))}
        <div ref={scrollDownRef}></div>
      </div>
    </div>
  );
};

export default SimpleLog;

