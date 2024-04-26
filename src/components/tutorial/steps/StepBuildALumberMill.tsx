import { useStructureState } from 'hooks/store/structures'
import StepTemplate, { type StepProps } from '../templates/StepTemplate'
import StepTemplateSuccess from '../templates/StepTemplateSuccess'
import { useEffect } from 'react'
import { nextTutorialStep, reduceTime } from 'store/actions/game'
import { useDispatch } from 'react-redux'
import { StructureState } from 'store/types/structure'
import { useStructureBuildingTaskState } from 'hooks/store/tasks'
import { TickingProgressbar } from 'components/ui/common/progress'
import { formatDuration } from 'utils/format/time'
import * as TextManager from 'global/TextManager'
import IconButton from 'components/ui/buttons/IconButton'
import { type Structure } from 'definitions/structures'
import Button from 'components/ui/buttons/Button'
import { setStructureState } from 'store/actions/structures'

const structure: Structure = 'lumberMill'
const StepBuildALumberMill = (props: StepProps) => {
  const { onToggle, showSuccess, onDismissSuccess } = props
  const dispatch = useDispatch()

  const buildTask = useStructureBuildingTaskState(structure)

  const structureState = useStructureState(structure)
  useEffect(() => {
    if (structureState.state === StructureState.Built) {
      dispatch(nextTutorialStep())
    }
  }, [dispatch, structureState.state])

  const handleReduceTime50 = () => {
    dispatch(reduceTime(50, 'task', `${structure}.build`))
  }

  const handleCheat = () => {
    dispatch(setStructureState(structure, StructureState.Built))
  }

  if (showSuccess || structureState.state === StructureState.Built) {
    return (
      <StepTemplateSuccess
        flavorText={<p>Aye, that's the spirit! Wi' the lumber mill back in action, we'll have the resources we need tae get things done. Nae time tae waste, let's roll up our sleeves and make it happen!</p>}
        onToggle={onToggle}
        onDismissSuccess={onDismissSuccess}
      />
    )
  }

  if (structureState.state === StructureState.Building && buildTask != null) {
    if (buildTask == null) return null
    return (
      <StepTemplate
        flavor={<>
          <p>
            Ach, naething left but tae wait, it seems. Patience is a virtue they say, but it's no' always easy, is it? We'll bide our time and see what unfolds.
          </p>
          <div className="building">
            <TickingProgressbar
              progress={buildTask.progress}
              label={TextManager.get('ui-structure-building', { time: formatDuration(buildTask.timeRemaining) })}
            />
            <IconButton iconImg="img/ui/misc/clock.png" size="smallest" onClick={handleReduceTime50}></IconButton>
          </div>
        </>}
        assignment="Wait for lumber mill to be built"
        onToggle={props.onToggle}
      />
    )
  }
  return (
    <StepTemplate
      flavor={<>
        <p>
          Aye, laddie, the first order o' business is tae get our stockpiles o' wood back in order. We'll need tae rebuild the lumber mill, nae doubt about it.
      </p>
      <p>
        I reckon we still have the deed tucked away in our warehouse. Time tae dust it off and put it tae good use!
        <Button color='red' onClick={handleCheat}>Cheat!</Button>
      </p>
      </>}
      assignment="Construct a lumber mill using the Deed for a Lumber mill (found in the stockpile in the warehouse in town)"
      onToggle={props.onToggle}
    />
  )
}

export default StepBuildALumberMill
