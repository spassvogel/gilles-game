// Todo: come up with a less stupid name
import * as React from 'react';
import './styles/updownvalue.scss';

export interface DispatchProps {
  onUp?: (e: React.MouseEvent) => void;
  onDown?: (e: React.MouseEvent) => void;
}
export interface Props extends DispatchProps {
  label?: string;
  value?: number;
  max?: number;
  upDisabled?: boolean;
  downDisabled?: boolean;
}

const UpDownValue = (props: Props) => {
  const handleUp = (e: React.MouseEvent) => {
    if (props.onUp && !props.upDisabled) { props.onUp(e); }
  };

  const handleDown = (e: React.MouseEvent) => {
    if (props.onDown && !props.downDisabled) { props.onDown(e); }
  };

  let displayValue;
  if (props.max == null) {
    displayValue = props.value;
  } else {
    displayValue = (
      <span>
        {props.value} / <span className="max">{ props.max }</span>
      </span>
    );
  }
  return (
    <div className="updownvalue">
        <label> { props.label }</label>
        { displayValue }
        <i className={ 'arrow up' + (props.upDisabled ? ' disabled' : '' )}
        onClick={handleUp}
        />
        <i className={'arrow down' + (props.downDisabled ? ' disabled' : '')}
        onClick={handleDown}
        />
    </div>
  );
};

export default UpDownValue;
