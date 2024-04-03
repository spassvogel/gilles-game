import './styles/showLabels.scss'

type Props = {
  showLabels: boolean
  onChange: (value: boolean) => void
}

const ShowLabels = (props: Props) => {
  const { showLabels, onChange } = props
  return (
    <div className="show-labels">
      <div className="content">
        <input
          type="checkbox"
          checked={showLabels}
          id="showLabels"
          onChange={(e) => { onChange(e.currentTarget.checked) }}
        />
        <label htmlFor="showLabels">
          Show building labels
        </label>
      </div>
    </div>
  )
}

export default ShowLabels
