import { type Application } from 'pixi.js'
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    __PIXI_INSPECTOR_GLOBAL_HOOK__: { register: (x: { PIXI: typeof PIXI }) => void }
    __PIXI_APP__: Application<ICanvas>
  }
}
