import * as TextManager from 'global/TextManager'

const RoomEmpty = () => {
  return (
    <div className="room empty">
      ({TextManager.get('ui-structure-tavern-room-empty')})
    </div>
  )
}

export default RoomEmpty
