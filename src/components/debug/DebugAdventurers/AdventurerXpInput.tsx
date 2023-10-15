import { levelToXp, MAX_XP, xpToLevel } from 'mechanics/adventurers/levels'

type Props = {
  xp: number
  onChange: (xp: number) => void
}

const AdventurerXpInput = (props: Props) => {
  const { xp, onChange } = props
  const level = xpToLevel(xp)
  const nextXp = levelToXp(level + 1)
  const progress = xp / nextXp

  return (
    <div className="xp-input input">
      <input
        type="number"
        min={0}
        max={MAX_XP}
        value={xp}
        className="xp"
        onChange={(e) => { onChange(+(e.currentTarget.value) - xp) }}
      />
      <div className="progress-mini-bg">
        <div
          className="progress-mini-bar"
          style={{ width: `${progress * 100}%` }}
        >
        </div>
      </div>
    </div>
  )
}

export default AdventurerXpInput
