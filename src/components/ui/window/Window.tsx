import * as React from 'react'
import { SoundManager } from 'global/SoundManager'
import Button from '../buttons/Button'
import { type PropsWithChildren, useEffect } from 'react'
import { appContext } from 'components/App/context'

import './styles/window.scss'

export type Props = {
  title: string
  closeEnabled?: boolean
}

/**
 *
 */
const Window = (props: PropsWithChildren<Props>) => {
  const app = React.useContext(appContext)
  const backEnabled = (app?.windowCount ?? 0) > 1

  const handleClose = (_e: React.MouseEvent) => {
    app?.onCloseWindow()
    void SoundManager.playSound('UI_BUTTON_CLICK')
  }

  const handleBack = (_e: React.MouseEvent) => {
    app?.onBackWindow()

    void SoundManager.playSound('UI_BUTTON_CLICK')
  }

  useEffect(() => {
    SoundManager.musicFiltered = true
    return () => {
      SoundManager.musicFiltered = false
    }
  })

  return (
    <div className="window">
      <div className="header">
        { backEnabled && (
          <Button
            className="back-button"
            onClick={handleBack}
            square={true}
            size={'medium'}
            color="purple"
          >
            {'<'}
          </Button>
        )}
        <h3>{ props.title }</h3>
        { props.closeEnabled !== false && (
          <Button
            className="close-button"
            onClick={handleClose}
            square={true}
            size={'medium'}
            color="purple"
            >
          ×
          </Button>
        )}
      </div>
      { props.children }
    </div>
  )
}

export default Window
