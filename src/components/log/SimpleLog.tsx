import SquareIconButton from "components/widgets/SquareIconButton";
import * as React from "react";
import { LogChannel, LogEntry } from "stores/logEntry";
import { TextManager } from "utils/textManager";
import "./css/simplelog.css";
import Tabstrip from "components/widgets/Tabstrip";
import Tab from "components/widgets/Tab";

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

interface LocalState {
    selectedTabId: string;
    expanded: boolean;
}

class SimpleLog extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            expanded: false,
            selectedTabId: "all",
        };
    }

    public render() {

        const channels: ChannelDefinition[] = [{
            label: TextManager.get("common-log-tab-all"),
            tabId: "all",
            tabType: ChannelType.all,
        }, {
            label: TextManager.get("common-log-tab-town"),
            tabId: "town",
            tabType: ChannelType.town,
        }];

        this.props.questNames.forEach((questName) => {
            channels.push({
                channelContext: questName,
                label: TextManager.getQuestTitle(questName),
                tabId: `quest-${questName}`,
                tabType: ChannelType.quest,
            });
        });

        let logEntries: LogEntry[] = [];
        const currentTab = channels.find((t) => t.tabId === this.state.selectedTabId)!;
        switch (currentTab.tabType) {
            case ChannelType.all:
                // All the things
                logEntries = this.props.logEntries;
                break;

            case ChannelType.town:
                // Only town
                logEntries = this.props.logEntries.filter((lE) => lE.channel === LogChannel.town);
                break;

            case ChannelType.quest:
                // Only the selected quest
                logEntries = this.props.logEntries.filter((lE) => lE.channel === LogChannel.quest && lE.channelContext === currentTab.channelContext);
                break;
        }

        const getLogEntryRow = (logEntry: LogEntry) => {
            const text = TextManager.get(logEntry.key, logEntry.channelContext);
            return <div className = "entry" key={ logEntry.time }>
                { text }
            </div>;
        };

        const Tabs = channels.map((tab) => {
            return <Tab label =  { tab.label } id = { tab.tabId } key = { tab.tabId } ></Tab>;
        });

        return <div className = { `log ${this.state.expanded ? "expanded" : ""}` }>
            <div className = "tab-bar">
                <Tabstrip className = "tabs"  onTabSelected = { (tabId: string) => this.handleTabSelected(tabId) } >
                    { Tabs }
                </Tabstrip>
                <SquareIconButton className = "expand-button" onClick = { () => this.handleToggleExpand() } text = { this.state.expanded ? "▼" : "▲" }/>
            </div>
            <div className = "log-entries">
                { logEntries.map((entry) => getLogEntryRow(entry))}
            </div>
        </div>;
    }

    private handleTabSelected(tabId: string) {
        this.setState({
            selectedTabId: tabId,
        });
    }

    private handleToggleExpand() {
        this.setState({
            expanded: !this.state.expanded,
        });
    }
}

export default SimpleLog;
