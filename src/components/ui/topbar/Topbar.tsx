import * as React from 'react'
import Resourcebar from './Resourcebar'
import { useContext } from 'react'
import { appContext } from 'components/App/context'
import Menu from '../window/windows/MenuWindow'

import './styles/topbar.scss'

const Topbar = () => {
  const app = useContext(appContext)

  const handleClick = (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const window = <Menu />
    app?.onOpenWindow(window)
  }

  return (
    <div className="topbar">
      <div className="topbar-left">
        <Resourcebar />
      </div>
      <div className="topbar-right">
        <div className="hamburger" onClick={handleClick}>☰</div>
      </div>
    </div>
  )
}
export default Topbar
