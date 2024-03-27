import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import StepIntroduction from './steps/StepIntroduction'
import { type StoreState } from 'store/types'

import './style/tutorial.scss'
import usePrevious from 'hooks/usePrevious'
import StepBuildATavern from './steps/StepBuildATavern'

const Tutorial = () => {
  const [collapsed, setCollapsed] = useState(false)
  const tutorial = useSelector((state: StoreState) => state.game.tutorial)
  const [dismissed, setDismissed] = useState(false)
  const previousStep = usePrevious(tutorial ?? 0)

  const handleToggle = () => {
    setCollapsed((o) => !o)
  }

  const handleDismissSuccess = () => {
    setDismissed(true)
  }

  useEffect(() => {
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
    switch (dismissed ? tutorial : Math.min(previousStep ?? 0, tutorial)) {
      case 0: {
        return (
          <StepIntroduction {...props} />
        )
      }
      case 1: {
        return (
          <StepBuildATavern {...props} />
        )
      }
    }
  }, [dismissed, previousStep, tutorial])

  return (
    <div className={`tutorial ${collapsed ? 'collapsed' : ''}`}>
      {step}
    </div>
  )
}

export default Tutorial
