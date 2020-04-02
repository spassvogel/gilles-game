import SquareIconButton from "components/ui/buttons/SquareIconButton";
import Tab from "components/ui/tabs/Tab";
import Tabstrip from "components/ui/tabs/Tabstrip";
import * as React from "react";
import { LogChannel, LogEntry } from "stores/logEntry";
import { TextManager } from "utils/textManager";
import "./css/simplelog.css";
import { useState } from 'react';

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

export interface StateProps  {
    logEntries: LogEntry[];
    questNames: string[];
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

type AllProps = Props & StateProps & DispatchProps;

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

const SimpleLog = (props: AllProps) => {

    const [expanded, setExpanded] = useState(false);
    const [selectedTabId, setSelectedTabId] = useState("all");

    const channels: ChannelDefinition[] = [{
        label: TextManager.get("common-log-tab-all"),
        tabId: "all",
        tabType: ChannelType.all,
    }, {
        label: TextManager.get("common-log-tab-town"),
        tabId: "town",
        tabType: ChannelType.town,
    }];

    const handleTabSelected = (tabId: string) => {
        setSelectedTabId(tabId);
    }
    
    const handleToggleExpand = () => {
        setExpanded(!expanded);
    }

    props.questNames.forEach((questName) => {
        channels.push({
            channelContext: questName,
            label: TextManager.getQuestTitle(questName),
            tabId: `quest-${questName}`,
            tabType: ChannelType.quest,
        });
    });

    let logEntries: LogEntry[] = [];
    const currentTab = channels.find((t) => t.tabId === selectedTabId)!;
    switch (currentTab.tabType) {
        case ChannelType.all:
            // All the things
            logEntries = props.logEntries;
            break;

        case ChannelType.town:
            // Only town
            logEntries = props.logEntries.filter((lE) => lE.channel === LogChannel.town);
            break;

        case ChannelType.quest:
            // Only the selected quest
            logEntries = props.logEntries.filter((lE) => lE.channel === LogChannel.quest && lE.channelContext === currentTab.channelContext);
            break;
    }

    const getLogEntryRow = (logEntry: LogEntry) => {
        const text = TextManager.get(logEntry.key, logEntry.context);
        return <div className = "entry" key={ logEntry.time }>
            { text }
        </div>;
    };

    const Tabs = channels.map((tab) => {
        return <Tab id = { tab.tabId } key = { tab.tabId } >{ tab.label }</Tab>;
    });

    return <div className = { `log ${expanded ? "expanded" : ""}` }>
        <div className = "tab-bar">
            <Tabstrip className = "tabs"  onTabSelected = { (tabId: string) => handleTabSelected(tabId) } >
                { Tabs }
            </Tabstrip>
            <SquareIconButton className = "expand-button" onClick = { () => handleToggleExpand() } text = { expanded ? "▼" : "▲" }/>
        </div>
        <div className = "log-entries">
            { logEntries.map((entry) => getLogEntryRow(entry))}
        </div>
    </div>;
}

export default SimpleLog;
