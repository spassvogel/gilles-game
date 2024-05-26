import './styles/goldamount.scss'
import Icon from '../common/Icon'

type Props = {
  amount: number
  disabled?: boolean
}

const GoldAmount = (props: Props) => {
  const { amount, disabled } = props
  const className = [
    'gold-amount',
    ...(disabled === true ? ['disabled'] : [])
  ].join(' ')

  return (
    <div className={className}>
      <div>(</div>
      <Icon
        size="smallest"
        image='img/ui/misc/coin-single.png'
      />
      <div className="amount">{amount}</div>
      <div>)</div>
    </div>
  )
}

export default GoldAmount
