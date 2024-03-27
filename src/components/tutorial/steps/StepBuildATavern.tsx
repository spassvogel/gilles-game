import { useStructureState } from 'hooks/store/structures'
import StepTemplate, { type StepProps } from '../templates/StepTemplate'
import StepTemplateSuccess from '../templates/StepTemplateSuccess'
import { useEffect } from 'react'
import { nextTutorialStep } from 'store/actions/game'
import { useDispatch } from 'react-redux'
import { StructureState } from 'store/types/structure'

const StepBuildATavern = (props: StepProps) => {
  const { onToggle, showSuccess, onDismissSuccess } = props
  const dispatch = useDispatch()

  const structureState = useStructureState('tavern')
  useEffect(() => {
    if (structureState.state === StructureState.Built) {
      dispatch(nextTutorialStep())
    }
  }, [dispatch, structureState.state])

  if (showSuccess) {
    return (
      <StepTemplateSuccess
        flavorText={<p>"Ah, it's grand tae hae the tavern back, isn't it? I'll be scurrying doon there meself tae have a wee dram or two. Can't resist a good drink and a blether with the lads!"</p>}
        onToggle={onToggle}
        onDismissSuccess={onDismissSuccess}
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
          The deed should still be in th' warehouse, laddie. Use it tae bring the tavern back tae its former glory!
        </p>
      </>}
      assignment="Construct a tavern using the Deed for a Tavern"
      onToggle={props.onToggle}
    />
  )
}

export default StepBuildATavern
