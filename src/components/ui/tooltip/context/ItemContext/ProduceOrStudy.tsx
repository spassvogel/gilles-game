import * as React from "react";
import { Item } from 'definitions/items/types';
import { getDefinition as getProductionDefinition, getProductionStructureForItem } from 'definitions/production';
import useStructureState from 'hooks/store/useStructureState';
import { Structure, getDefinition as getStructureDefinition } from 'definitions/structures';
import { ProductionStructureStoreState } from 'stores/structure';
import { getDefinition as getItemDefinition } from 'definitions/items';
import { ProductionDefinition } from 'definitions/production/types';
import { Link } from 'react-router-dom';
import { getStructureLink } from 'utils/routing';
import { TextManager } from 'global/TextManager';
import { useStudyingTasksStateByStructure } from 'hooks/store/useTasksState';
import { startTask } from 'actions/tasks';
import { TaskType } from 'stores/task';
import { useDispatch } from 'react-redux';
import { addItemToToProduces } from 'actions/structures';
import { formatDuration } from 'utils/time';
import { STUDY_TIME } from 'mechanics/studying';

interface Props {
    item: Item;
}

const ProduceOrStudy = (props: Props) => {
    const structure = getProductionStructureForItem(props.item);
    const itemDefinition = getItemDefinition(props.item);
    if (itemDefinition.unique) {
        return (
            <p>Unique item</p>
        )
    }
    if (!structure) {
        return null;
    }
    return (
        <ProducedAtStructure item={props.item} structure={structure} />
    )
}

const ProducedAtStructure = (props: Props & { structure: Structure}) => {
    const {structure} = props;
    const structureStore: ProductionStructureStoreState = useStructureState(structure);
    const studyTasks = useStudyingTasksStateByStructure(structure);
    const dispatch = useDispatch();

    if (!structure) {
        return null;
    }

    // const structureDefinition = getStructureDefinition<ProductionStructureDefinition>(structure);
    // const productionDefinition = getProductionDefinition(props.item);

    // Can already be produced
    if (structureStore.produces.some((item: Item) => item === props.item)){
        return (
            <p>Constructed at:&nbsp;
                <Link to={getStructureLink(structure)} >
                    { TextManager.getStructureName(structure) }
                </Link>
            </p>
        )
    }

    // Currently studied
    const task = studyTasks.find(sT => sT.name === props.item);
    if (task) {
        return (
            <p>
                <Link to={getStructureLink(structure)} >
                    {TextManager.get("ui-tooltip-study-currently-studying")}
                </Link>
                {formatDuration(task.timeRemaining, true)}
            </p>
        )
    }

    const startStudy = () => {
        const callbacks = [
            addItemToToProduces(props.structure, props.item)
        ];

        const studyTime = STUDY_TIME;
        const start = startTask(TaskType.studyItem,
            props.item,
            `${structure}.study`,
            studyTime,
            callbacks);
        dispatch(start);
    }

    // todo: level requirement?
    return (
        <p>
            <button onClick={startStudy}>
                {TextManager.get("ui-tooltip-study-start-study")}
            </button>
        </p>
    );
}

export default ProduceOrStudy;