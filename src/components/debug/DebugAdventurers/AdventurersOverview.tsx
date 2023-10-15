import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import { IconSize } from 'components/ui/common/Icon'
import { TextManager } from 'global/TextManager'
import { useAdventurers } from 'hooks/store/adventurers'
import './styles/adventurersOverview.scss'

type Props = {
  onSetSelectedId: (id: string) => void
}

const AdventurersOverview = (props: Props) => {
  const { onSetSelectedId } = props
  const adventurers = useAdventurers()

  return (
    <div className="adventurers-overview">
      {adventurers.map(a => (
        <div className="adventurer" key={a.id} onClick={() => { onSetSelectedId(a.id) }}>
          <AdventurerAvatar adventurer={a} size={IconSize.biggest} />
          <div className="name">
            {TextManager.getAdventurerName(a.id)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdventurersOverview
