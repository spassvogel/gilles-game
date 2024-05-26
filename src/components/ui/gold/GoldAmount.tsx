import './styles/goldamount.scss'
import Icon from '../common/Icon'

type Props = {
  amount: number
}

const GoldAmount = (props: Props) => {
  const { amount } = props
  return (
    <div className='gold-amount'>
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
