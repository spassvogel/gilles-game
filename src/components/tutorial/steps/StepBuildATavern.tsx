import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useStructureState } from 'hooks/store/structures'
import StepTemplate, { type StepProps } from '../templates/StepTemplate'
import StepTemplateSuccess from '../templates/StepTemplateSuccess'
import { nextTutorialStep, reduceTime } from 'store/actions/game'
import { StructureState } from 'store/types/structure'
import { useStructureBuildingTaskState } from 'hooks/store/tasks'
import { type Structure } from 'definitions/structures'
import { TickingProgressbar } from 'components/ui/common/progress'
import * as TextManager from 'global/TextManager'
import { formatDuration } from 'utils/format/time'
import IconButton from 'components/ui/buttons/IconButton'
import Button from 'components/ui/buttons/Button'
import { setStructureState } from 'store/actions/structures'

const structure: Structure = 'tavern'
const StepBuildATavern = (props: StepProps) => {
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

  if (showSuccess) {
    return (
      <StepTemplateSuccess
        flavorText={"Ah, it's grand tae hae the tavern back, isn't it? I'll be scurrying doon there meself tae have a wee dram or two. Can't resist a good drink and a blether with the lads!"}
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
        assignment="Wait for tavern to be built"
        onToggle={props.onToggle}
      />
    )
  }
  return (
    <StepTemplate
      flavor={<>
        <p>
          We used tae hae a tavern here, a guid ane at that! Tankards clinked by adventurers an' luck seekers frae far an' wide. Plans were hatched fer darin' capers an' quests o' grandeur!
        </p>
        <p>
          Aye, once the lads at the mill have toiled enough and stacked up a bonnie pile o' wood, it'll be time to dust off that deed and restore the old place to its former glory.
          <Button color='red' onClick={handleCheat} className="button-cheat">Cheat!</Button>
        </p>
      </>}
      assignment="Construct a tavern using the Deed for a Tavern"
      onToggle={props.onToggle}
    />
  )
}

export default StepBuildATavern
