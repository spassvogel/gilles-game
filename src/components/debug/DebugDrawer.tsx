import { useState } from 'react'
import useKey from '@rooks/use-key'
import DebugView from './DebugView'
import { useSettings } from 'hooks/store/settings'
import './styles/debugDrawer.scss'

const DebugDrawer = () => {
  const [open, setOpen] = useState(false)
  const settings = useSettings()

  useKey('~', () => {
    setOpen(!open && settings.debug.enableDebugDrawer)
  })
  useKey('1', () => {
    setOpen(!open && settings.debug.enableDebugDrawer)
  })

  if (!open) return null
  return (
    <div className="debug-drawer">
      <div className="close" onClick={() => { setOpen(false) }}>×</div>
      <DebugView />
    </div>
  )
}

export default DebugDrawer
