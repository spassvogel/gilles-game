
import * as React from "react";
import { LogEntry, LogChannel } from "stores/logEntry";
import { TextManager } from "utils/textManager";
import "./css/simplelog.css";

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

enum TabType {
    all,
    town,
    quest,
}

interface TabDefinition {
    label: string;
    tabType: TabType;
    tabId: string;
    context?: string;
}

interface LocalState {
    selectedTabId: string;
}

class SimpleLog extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            selectedTabId: "all",
        };
    }

    public render() {

        const tabs: TabDefinition[] = [{
            label: TextManager.get("common-log-tab-all"),
            tabId: "all",
            tabType: TabType.all,
        }, {
            label: TextManager.get("common-log-tab-town"),
            tabId: "town",
            tabType: TabType.town,
        }];

        this.props.questNames.forEach((questName) => {
            tabs.push({
                context: questName,
                label: TextManager.getQuestTitle(questName),
                tabId: `quest-${questName}`,
                tabType: TabType.quest,
            });
        });

        let logEntries: LogEntry[] = [];
        const currentTab = tabs.find((t) => t.tabId === this.state.selectedTabId)!;
        switch (currentTab.tabType) {
            case TabType.all:
                // All the things
                logEntries = this.props.logEntries;
                break;

            case TabType.town:
                // Only town
                logEntries = this.props.logEntries.filter((lE) => lE.channel === LogChannel.town);
                break;

            case TabType.quest:
                // Only the selected quest
                logEntries = this.props.logEntries.filter((lE) => lE.channel === LogChannel.quest && lE.context === currentTab.context);
                break;
        }

        const getLogEntryRow = (logEntry: LogEntry) => {
            const text = TextManager.get(logEntry.key, logEntry.context);
            return <div className = "entry" key={ logEntry.time }>
                { text }
            </div>;
        };

        return <div className = "log">
            <ul className = "tabs">
                {
                    tabs.map((tab) => {
                        return <li
                            key = { tab.tabId }
                            className = { this.state.selectedTabId === tab.tabId ? "active" : "" }
                            onClick = { () => this.handleTabClick(tab.tabId) }
                        >
                            { tab.label }
                        </li>;
                    })
                }
            </ul>
            <div className = "log-entries">
                { logEntries.map((entry) => getLogEntryRow(entry))}
            </div>
        </div>;
    }

    private handleTabClick(tabId: string) {
        this.setState({
            selectedTabId: tabId,
        });
    }
}

export default SimpleLog;
