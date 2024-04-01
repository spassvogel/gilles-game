import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import StepIntroduction from './steps/StepIntroduction'
import { type StoreState } from 'store/types'
import usePrevious from 'hooks/usePrevious'
import StepBuildATavern from './steps/StepBuildATavern'
import StepBuildALumberMill from './steps/StepBuildALumberMill'
import StepAssignWorkersToLumberMill from './steps/StepAssignWorkersToLumberMill'

import './style/tutorial.scss'
import { SoundManager } from 'global/SoundManager'

// All the tutorial steps in the correct order
const stepComponents = [
  StepIntroduction,
  StepBuildALumberMill,
  StepAssignWorkersToLumberMill,
  StepBuildATavern
]

const Tutorial = () => {
  const [collapsed, setCollapsed] = useState(false)
  const tutorial = useSelector((state: StoreState) => state.game.tutorial)
  const [dismissed, setDismissed] = useState(false)
  const previousStep = usePrevious(tutorial ?? 0)

  const handleToggle = () => {
    setCollapsed((o) => !o)
  }

  const handleDismissSuccess = () => {
    void SoundManager.playSound('UI_BUTTON_CLICK')

    setDismissed(true)
  }

  useEffect(() => {
    void SoundManager.playSound('UI_BUTTON_CLICK')

    console.log(`tutorial`, tutorial)
    setDismissed(false)
  }, [tutorial])

  const step = useMemo(() => {
    console.log(`previousStep`, previousStep)
    console.log(`tutorial`, tutorial)
    const props = {
      showSuccess: tutorial !== previousStep && !dismissed,
      onToggle: handleToggle,
      onDismissSuccess: handleDismissSuccess
    }
    const stepIndex = (dismissed || previousStep == null ? tutorial : (previousStep ?? tutorial))
    const Component = stepComponents[stepIndex]
    if (Component == null) {
      return null
    }
    return <Component {...props} />
  }, [dismissed, previousStep, tutorial])

  return (
    <div className={`tutorial ${collapsed ? 'collapsed' : ''}`}>
      {step}
    </div>
  )
}

export default Tutorial
