import { Assets } from 'pixi.js'
import { createRoot } from 'react-dom/client'
import * as TextManager from 'global/TextManager'
import Game from 'components/Game'
import * as random from './utils/random'
import './index.css'

const root = createRoot(document.getElementById('root') as HTMLElement)
const texts = await Assets.load<Record<string, string>>('/lang/en.json')
TextManager.init(texts)

random.init('GILLESROX2')

root.render(
  // <React.StrictMode>
    <Game />
  // </React.StrictMode>
)
