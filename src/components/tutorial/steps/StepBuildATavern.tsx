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
        flavorText={"Ah, it's grand tae hae the tavern back, isn't it? I'll be scurrying doon there meself tae have a wee dram or two. Can't resist a good drink and a blether with the lads!"}
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
          Aye, once the lads at the mill have toiled enough and stacked up a bonnie pile o' wood, it'll be time to dust off that deed and restore the old place to its former glory.
        </p>
      </>}
      assignment="Construct a tavern using the Deed for a Tavern"
      onToggle={props.onToggle}
    />
  )
}

export default StepBuildATavern
