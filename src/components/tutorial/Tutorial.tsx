import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import StepIntroduction from './steps/StepIntroduction'
import { type StoreState } from 'store/types'
import usePrevious from 'hooks/usePrevious'
import StepBuildATavern from './steps/StepBuildATavern'
import StepBuildALumberMill from './steps/StepBuildALumberMill'
import StepAssignWorkersToLumberMill from './steps/StepAssignWorkersToLumberMill'
import StepLodge5Adventurers from './steps/StepLodge5Adventurers'
import { SoundManager } from 'global/SoundManager'
import localforage from 'localforage'
import { STORAGE_KEY_TUTORIAL_COLLAPSED } from 'constants/storage'

import './styles/tutorial.scss'

// All the tutorial steps in the correct order
const stepComponents = [
  StepIntroduction,
  StepBuildALumberMill,
  StepAssignWorkersToLumberMill,
  StepBuildATavern,
  StepLodge5Adventurers
]

const Tutorial = () => {
  const [collapsed, setCollapsed] = useState(true)
  const tutorial = useSelector((state: StoreState) => state.game.tutorial)
  const [dismissed, setDismissed] = useState(false)
  const previousStep = usePrevious(tutorial)

  const handleToggle = useCallback(() => {
    setCollapsed((o) => !o)
    void localforage.setItem(STORAGE_KEY_TUTORIAL_COLLAPSED, !collapsed)
  }, [collapsed])

  useEffect(() => {
    const update = async () => {
      setCollapsed(await localforage.getItem(STORAGE_KEY_TUTORIAL_COLLAPSED) === true)
    }
    void update()
  }, [])

  const handleDismissSuccess = () => {
    void SoundManager.playSound('UI_BUTTON_CLICK')

    setDismissed(true)
  }

  useEffect(() => {
    void SoundManager.playSound('UI_BUTTON_CLICK')
    setDismissed(false)
  }, [previousStep, tutorial])

  const step = useMemo(() => {
    const props = {
      showSuccess: tutorial !== previousStep && !dismissed && previousStep != null,
      onToggle: handleToggle,
      onDismissSuccess: handleDismissSuccess
    }
    const stepIndex = (dismissed || previousStep == null ? tutorial : (previousStep ?? tutorial))
    const Component = stepComponents[stepIndex]
    if (Component == null) {
      return null
    }
    return <Component {...props} />
  }, [dismissed, handleToggle, previousStep, tutorial])

  return (
    <div className={`tutorial ${collapsed ? 'collapsed' : ''}`}>
      {step}
    </div>
  )
}

export default Tutorial
