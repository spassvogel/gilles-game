import { Assets } from 'pixi.js'
import { createRoot } from 'react-dom/client'
import * as TextManager from 'global/TextManager'
import Game from 'components/Game'
import * as random from './utils/random'
import { defineAssetPath } from 'utils/assets'

import './index.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!)

// why you no work?
// Assets.init({
//   basePath: `${import.meta.env.BASE_URL}`
// })
const texts = await Assets.load<Record<string, string>>(defineAssetPath('lang/en.json'))
TextManager.init(texts)

random.init('GILLESROX2')

root.render(
  // <React.StrictMode>
    <Game />
  // </React.StrictMode>
)
