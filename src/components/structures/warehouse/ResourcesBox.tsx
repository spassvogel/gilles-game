import { useRef } from "react";
import { useSelector } from 'react-redux';
import { Resource } from "definitions/resources";
import resourceDescriptions from "definitions/resources";
import { ResourceStoreState } from "store/types/resources";
import { TextManager } from "global/TextManager";
import ReactMarkdown from "react-markdown";
import { StructuresStoreState } from 'store/types/structures';
import { getStructureByResource } from 'definitions/structures';
import { withAppContext, AppContextProps } from 'hoc/withAppContext';
import { StoreState } from 'store/types';
import { StructureState } from 'store/types/structure';
import { formatNumber } from 'utils/format/number';
import Icon from '../../ui/common/Icon';
import { BubbleLayer, BubbleManager, BubbleType } from "global/BubbleManager";
import { Point } from "pixi.js";
import "./styles/resourcesBox.scss";

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
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={className} ref={ref}>
      {
        Object.keys(resources).map((value: string) => {
          const resource = value as Resource;
          const resourceDescription = resourceDescriptions[resource];
          const amount = props.resources[resource] || 0;
          if (!resourceDescription) {
            throw new Error(`No resource description found for ${resource}`);
          }

          if (deltaResources[resource]) {
            // Show bubble
            const el = ref.current?.querySelector(`[data-resource="${resource}"] .amount`);
            const rect = el?.getBoundingClientRect();
            const point = new Point(rect?.right, rect?.top)

            BubbleManager.addBubble(`+ ${deltaResources[resource]?.toFixed(2)}`, point, BubbleType.resource, BubbleLayer.general);
          }

          const structure = getStructureByResource(Resource[resource]);

          const full = amount >= (props.maxResources?.[resource] ?? 0);
          const structureText = TextManager.get(structures[structure].state === StructureState.Built ? "ui-structure-warehouse-resources-source" : "ui-structure-warehouse-resources-source-unbuilt", {structure})
          return (
            <div className="row" data-resource={resource} key={resource}>
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
              <div className="structure">
                <ReactMarkdown>{structureText}</ReactMarkdown>
              </div>
            </div>
          )
        })
      }
    </div>
  );
};

export default withAppContext(ResourcesBox);


