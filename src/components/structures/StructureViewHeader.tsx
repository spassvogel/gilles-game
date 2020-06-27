import React from "react";
import { Structure } from 'definitions/structures';
import "./css/structureviewheader.css";

interface Props {
    structure: Structure;
}

const StructureViewHeader = (props: Props) => {
    // const displayName = TextManager.getStructureName(props.structure);
    return (
        <div className={`structureview-header structureview-header-${props.structure}`}>
            {/* <h1 className="app-h1-white">{displayName}</h1> */}
        </div>
    );
}

export default StructureViewHeader;