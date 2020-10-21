import { Resource } from "definitions/resources";
import resourceDescriptions from "definitions/resources";
import * as React from "react";
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
import { getClassName, IconSize } from 'constants/icons';
import "components/ui/styles/icon.scss";
import "./styles/resourcesbox.scss";

export interface Props {
    className?: string;
    resources: ResourceStoreState;
    structures: StructuresStoreState;
    maxResources: ResourceStoreState;
    deltaResources: ResourceStoreState;
}

export interface StateProps {
    sufficientResources?: Record<Resource, boolean>;
}

type AllProps = Props & StateProps;

/**
 * The ResourcesBox is used in the Warehouse to show a list of resources
 */
const ResourcesBox = (props: AllProps & AppContextProps) => {
    const {
        sufficientResources,
        resources,
        deltaResources,
    } = props;
    const structures = useSelector<StoreState, StructuresStoreState>(store => store.structures);

    const className=(props.className || "") + " resourcesbox";
    const listItems = Object.keys(resources).map((resource: string) => {
        let listItemClass = "resource";
        if (sufficientResources && !sufficientResources[resource]) {
             listItemClass += " insufficient";
        }
        const resourceDescription=resourceDescriptions[resource];
        const amount = props.resources[resource]!;
        if (!resourceDescription) {
            throw new Error(`No resource description found for ${resource}`);
        }

        let delta;
        if (deltaResources[resource]) {
            delta = <span className="animate-up">
                { `+ ${deltaResources[resource]!.toFixed(2)}`  }
            </span>;
        }

        const structure = getStructureByResource(Resource[resource]);

        const handleStructureClick=() => {
            props.onCloseWindow();
        }

        return (
            <li className={listItemClass} key={resource}>
                <div
                    className={`icon ${getClassName(IconSize.smallest)}`}
                    style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}${resourceDescription.iconImg})`,
                    }}
                />
                <div className="name">
                    { TextManager.getResourceName(resource as Resource) }
                </div>
                <div className="amount" >
                    { amount.toFixed(1) }
                </div>
                <div className="max" >
                    { ` / ${props.maxResources[resource]}` }
                </div>
                <div className="delta">
                    { delta }
                </div>
                <div className="structure">
                    source:
                    { structures[structure].state === StructureState.Built ? (
                        <Link to={getStructureLink(structure)} onClick={handleStructureClick}>
                            { TextManager.getStructureName(structure) }
                        </Link>
                    ) : (
                        TextManager.getStructureName(structure)
                    )}
                </div>
            </li>
        );
    });

    return (
        <ul className={ className } >
            { listItems }
        </ul>
    );
};

export default withAppContext(ResourcesBox);


