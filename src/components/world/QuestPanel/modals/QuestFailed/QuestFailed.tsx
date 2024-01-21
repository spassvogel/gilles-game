import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { TextManager } from 'global/TextManager'
import Button from 'components/ui/buttons/Button'
import { dismissQuest } from 'store/actions/quests'
import { getWorldLink } from 'utils/routing'

import '../styles/modal.scss'
import '../styles/questFailed.scss'

type Props = {
  questName: string
}

const QuestFailed = (props: Props) => {
  const { questName } = props
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDismissQuest = () => {
    navigate(getWorldLink())

    dispatch(dismissQuest(questName))
  }

  return (
    <div className={'interaction-modal quest-failed'}>
      <div className="header">
        <div className="title">
          {TextManager.get('quest-panel-modal-quest-failed-title')}
        </div>
      </div>
      <div className="content">
        <p>
          {TextManager.get('quest-panel-modal-quest-failed-body')}
        </p>
        <Button onClick={handleDismissQuest} color="purple">
          {TextManager.get('quest-panel-modal-quest-failed-dismiss')}
        </Button>
      </div>
    </div>
  )
}

export default QuestFailed
