import * as React from "react";
import { Resource } from "definitions/resources";
import resourceDescriptions from "definitions/resources";
import { ResourceStoreState } from "store/types/resources";
import { TextManager } from "global/TextManager";
import { StructuresStoreState } from 'store/types/structures';
import { getStructureByResource } from 'definitions/structures';
import { Link } from 'react-router-dom';
import { getStructureLink } from 'utils/routing';
import { withAppContext, AppContextProps } from 'hoc/withAppContext';
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { StructureState } from 'store/types/structure';
import { formatNumber } from 'utils/format/number';
import Icon from '../../ui/common/Icon';
import "./styles/resourcesBox.scss";
import ReactMarkdown from "react-markdown";

export interface Props {
    className?: string;
    resources: ResourceStoreState;
    structures: StructuresStoreState;
    maxResources: ResourceStoreState;
    deltaResources: ResourceStoreState;
}

/**
 * The ResourcesBox is used in the Warehouse to show a list of resources
 */
const ResourcesBox = (props: Props & AppContextProps) => {
    const {
        resources,
        deltaResources,
    } = props;
    const structures = useSelector<StoreState, StructuresStoreState>(store => store.structures);
    const className = `resources-box ${(props.className || "")}`;

    return (
        <div className={className}>
            {
                Object.keys(resources).map((value: string) => {
                    const resource = value as Resource;
                    const resourceDescription = resourceDescriptions[resource];
                    const amount = props.resources[resource] || 0;
                    if (!resourceDescription) {
                        throw new Error(`No resource description found for ${resource}`);
                    }

                    let delta;
                    if (deltaResources[resource]) {
                        delta = <span className="animate-up">
                            { `+ ${deltaResources[resource]?.toFixed(2)}`  }
                        </span>;
                    }

                    const structure = getStructureByResource(Resource[resource]);

                    const handleStructureClick=() => {
                        props.onCloseWindow();
                    }
                    const full = amount >= (props.maxResources?.[resource] ?? 0);
                    const structureText = TextManager.get(structures[structure].state === StructureState.Built ? "ui-structure-warehouse-resources-source" : "ui-structure-warehouse-resources-source-unbuilt", {structure}) 
                    return (
                        <React.Fragment key={resource}>
                            <Icon image={resourceDescription.iconImg} size="smallest"/>
                            <div className="name">
                                { TextManager.getResourceName(resource as Resource) }
                            </div>
                            <div className={`amount${full ? " full" : ""}`}  >
                                { formatNumber(amount, 0) }
                            </div>
                            <div className="max" >
                                { ` / ${props.maxResources[resource]}` }
                            </div>
                            <div className="delta">
                                { delta }
                            </div>
                            <div className="structure">
                                <ReactMarkdown>{structureText}</ReactMarkdown>
                            </div>
                        </React.Fragment>
                    )
                })
            }
        </div>
    );
};

export default withAppContext(ResourcesBox);


