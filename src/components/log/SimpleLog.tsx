
import * as React from "react";
import { LogEntry } from "src/stores/logEntry";
import "./css/simplelog.css";
import { TextManager } from "src/utils/textManager";

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

export interface StateProps  {
    logEntries: LogEntry[];
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

type AllProps = Props & StateProps & DispatchProps;

const getLogEntryRow = (logEntry: LogEntry) => {
    const text = TextManager.get(logEntry.key, logEntry.context);
    return <div className="entry" key={ logEntry.time }>
        { text }
    </div>;
};

const SimpleLog = (props: AllProps) => {

    return <div className="log-entries">
        { props.logEntries.map(entry => getLogEntryRow(entry))}
    </div>;
};
export default SimpleLog;
