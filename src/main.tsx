import { createRoot } from 'react-dom/client'
import * as TextManager from 'global/TextManager'
import Game from 'components/Game'
import * as random from './utils/random'

import './index.css'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!)

// why you no work?
// Assets.init({
//   basePath: `${import.meta.env.BASE_URL}`
// })

// not sure why this is needed
TextManager.init({})
random.init('GILLESROX2')

root.render(
  // <React.StrictMode>
    <Game />
  // </React.StrictMode>
)
