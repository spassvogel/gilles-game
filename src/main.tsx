import { Assets } from 'pixi.js'
import { createRoot } from 'react-dom/client'
import { TextManager } from 'global/TextManager'
import Game from 'components/Game'
import './index.css'

const root = createRoot(document.getElementById('root') as HTMLElement)
const texts = await Assets.load<Record<string, string>>('/lang/en.json')
TextManager.init(texts)

root.render(
  // <React.StrictMode>
    <Game />
  // </React.StrictMode>
)