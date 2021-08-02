import * as React from "react";
import ResourcesBox from "components/structures/warehouse/ResourcesBox";
import { WarehouseStructureDefinition, WarehouseStructureLevelDefinition } from "definitions/structures/types";
import usePrevious from "hooks/usePrevious";
import { useEffect, useRef, useState } from "react";
import { empty, ResourceStoreState } from "store/types/resources";
import { StructuresStoreState } from "store/types/structures";
import { TextManager } from "global/TextManager";
import { TooltipManager } from 'global/TooltipManager';
import AdventurerTabstrip from 'components/world/QuestPanel/AdventurerTabstrip';
import { useStructureDefinition, useStructureLevel, useStructureState } from 'hooks/store/structures';
import { useResourcesState } from 'hooks/store/resources';
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { useAdventurersInTown } from 'hooks/store/adventurers';
import StructureLevel from '../StructureLevel';
import AdventurerPanel from 'components/ui/adventurer/AdventurerPanel';
import { ContextType } from 'constants/context';
import { Resource } from "definitions/resources";
import UpgradeHelpModal from "../UpgradeHelpModal";
import UpgradeHelpModalContent from "./UpgradeHelpModalContent";
import Stockpile from "./Stockpile";
import "./styles/warehouseStructureView.scss";
import { Item } from "definitions/items/types";


const WarehouseStructureView = () => {

    const adventurersInTown = useAdventurersInTown();
    const [selectedAdventurer, setSelectedAdventurer] = useState<string>(adventurersInTown[0]?.id);
    const resources = useResourcesState();
    const [resourcesDelta, setResourcesDelta] = useState<ResourceStoreState>(empty);    // updating this will trigger animation
    const previousResources = usePrevious(resources);
    const resourcesRef = useRef<HTMLFieldSetElement>(null);
    const structuresState = useSelector<StoreState, StructuresStoreState>(store => store.structures);

    useEffect(() => {
        // Calculate delta
        const delta = Object.keys(resources).reduce<ResourceStoreState>((acc, value) => {
            const resource = value as Resource;
            if (previousResources && previousResources[resource]) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                acc[resource] = resources[resource]! - previousResources[resource]!;
            }
            return acc;
        }, {});

        setResourcesDelta(delta);
    }, [resources, previousResources]);

    useEffect(() => {
        if (!resourcesRef.current) {
            return;
        }
        const ref = resourcesRef.current as unknown as HTMLFieldSetElement;
        ref.classList.remove("animate");
        const timeout = setTimeout(() => {
            if (resourcesRef) {
                ref.classList.add("animate");
            }
        }, 200);
        return () => { clearTimeout(timeout); }
    }, [resourcesDelta]);

    const structureDefinition = useStructureDefinition<WarehouseStructureDefinition>("warehouse");
    const structureState = useStructureState("warehouse");
    const { level } = structureState;
    const levelDefinition = useStructureLevel<WarehouseStructureLevelDefinition>("warehouse");
    

    const handleAdventurerTabSelected = (tabId: string) => {
        setSelectedAdventurer(tabId);
    };

    const handleHelpClicked = (event: React.MouseEvent) => {
        const origin = (event.currentTarget as HTMLElement);
        const originRect = origin.getBoundingClientRect();
        const content = (
            <UpgradeHelpModal level={level} structure={"warehouse"}>
                <UpgradeHelpModalContent level={level} />
            </UpgradeHelpModal>
        );
        TooltipManager.showContextTooltip(ContextType.component, content, originRect, "upgrade-structure-tooltip");

        event.stopPropagation();
    }

    const handleUpgradeCallbacks = (nextLevel: number) => {
        const currentLevelDefinition = structureDefinition.levels[structureState.level];
        const nextLevelDefinition = structureDefinition.levels[nextLevel];
        const slots = nextLevelDefinition.maxStockpile - currentLevelDefinition.maxStockpile;
        return [
            // addStockpileSlots(slots)
        ]
    }

    return (
        <div className="warehouse-structureview">
            <StructureLevel structure={"warehouse"} onHelpClicked={handleHelpClicked} addUpgradeCallbacks={handleUpgradeCallbacks}/>
            <fieldset className="resources" ref={resourcesRef}>
                <legend>{TextManager.get("ui-structure-warehouse-resources")}</legend>
                <ResourcesBox
                    resources={resources}
                    structures={structuresState}
                    maxResources={levelDefinition.maxResources}
                    deltaResources={resourcesDelta}
                />
            </fieldset>
            <h3>{TextManager.get("ui-structure-warehouse-stockpile")}</h3>
            <Stockpile />
            <h3>{TextManager.get("ui-structure-warehouse-adventurers")}</h3>
            <div>
                <AdventurerTabstrip
                    adventurers={adventurersInTown}
                    selectedAdventurerId={selectedAdventurer}
                    onAdventurerTabSelected={handleAdventurerTabSelected}
                />
                <div className="adventurer-inventory">
                    { selectedAdventurer && (
                        <AdventurerPanel
                            adventurerId={selectedAdventurer}
                            horizontalMode={true}
                            traits={false}
                            skills={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );

};

export default WarehouseStructureView;
