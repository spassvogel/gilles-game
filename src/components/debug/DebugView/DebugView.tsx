import { useState } from 'react'
import Button from 'components/ui/buttons/Button'
import DebugItems from '../DebugItems'
import DebugSprites from '../DebugSprites/DebugSprites'
import DebugAdventurers from '../DebugAdventurers'
import DebugContext from '../DebugContext/DebugContext'
import './styles/debugView.scss'

const allPages = ['context', 'items', 'sprites', 'adventurers'] as const
type Page = typeof allPages[number]

const DebugView = () => {
  const [page, setPage] = useState<Page>('context')

  return (
    <div className="debug">
      <ul className="menu">
        <li>
          <Button onClick={() => { setPage('context') }} color={page === 'context' ? 'green' : 'blue'}> Context</Button>
        </li>
        <li>
          <Button onClick={() => { setPage('items') }} color={page === 'items' ? 'green' : 'blue'}> Items</Button>
        </li>
        <li>
          <Button onClick={() => { setPage('sprites') }} color={page === 'sprites' ? 'green' : 'blue'}> Sprites</Button>
        </li>
        <li>
          <Button onClick={() => { setPage('adventurers') }} color={page === 'adventurers' ? 'green' : 'blue'}> Adventurers</Button>
        </li>
      </ul>
      { page === 'context' && <DebugContext />}
      { page === 'items' && <DebugItems />}
      { page === 'sprites' && <DebugSprites />}
      { page === 'adventurers' && <DebugAdventurers />}
    </div>
  )
}

export default DebugView
