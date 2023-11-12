import * as React from 'react'

import './styles/numberdial.scss'

export type Props = {
  label?: string
  value?: number
  max?: number
  upDisabled?: boolean
  downDisabled?: boolean
  onUp?: (e: React.MouseEvent) => void
  onDown?: (e: React.MouseEvent) => void
}

const UpDownValue = (props: Props) => {
  const handleUp = (e: React.MouseEvent) => {
    if ((props.onUp != null) && props.upDisabled !== true) { props.onUp(e) }
  }

  const handleDown = (e: React.MouseEvent) => {
    if ((props.onDown != null) && props.downDisabled !== true) { props.onDown(e) }
  }

  let displayValue
  if (props.max == null) {
    displayValue = props.value
  } else {
    displayValue = (
      <span className="value">
        {props.value} / <span className="max">{ props.max }</span>
      </span>
    )
  }
  return (
    <div className="number-dial">
        <label> { props.label }</label>
        { displayValue }
        <i
          className={`arrow up ${(props.upDisabled === true ? ' disabled' : '')}`}
          onClick={handleUp}
        />
        <i
          className={`arrow down ${(props.downDisabled === true ? ' disabled' : '')}`}
          onClick={handleDown}
        />
    </div>
  )
}

export default UpDownValue
