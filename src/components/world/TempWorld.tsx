
import * as React from "react";
import { ContextInfo, ContextType } from "src/constants";
import { EquipmentDefinition } from "src/definitions/equipment/types";
import "./css/topbar.css";
import { QuestState } from "src/definitions/encounters/backstabbed";

export interface Props {
    type: ContextType;
    info: ContextInfo;
}

export interface StateProps {
    quests: QuestState[];
}

export interface DispatchProps {
}

type AllProps = Props & StateProps & DispatchProps;

export default function(props: AllProps) {
    
}
