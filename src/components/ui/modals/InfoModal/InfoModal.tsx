import { type PropsWithChildren } from 'react'
import { InfoWindow } from '../InfoWindow/InfoWindow'

import './styles/infoModal.scss'

export type Props = {
  className?: string
}

// An InfoModal is a semi transparant modal.
const InfoModal = (props: PropsWithChildren<Props>) => {
  const { className, children } = props

  return (
    <InfoWindow className={`info-modal ${className ?? ''}`}>
      {children}
    </InfoWindow>
  )
}

export default InfoModal
