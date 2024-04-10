import LoadingPage from 'components/ui/loading/LoadingPage'
import { manifest } from 'bundles/manifest'
import { Assets } from 'pixi.js'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useLoadTexts } from './hooks/useLoadTexts'

type Props = PropsWithChildren<unknown>

void Assets.init({ manifest })

const AssetLoader = (props: Props) => {
  const { children } = props
  const [assetsLoaded, setAssetLoaded] = useState(false)
  const [textLoaded, setTextLoaded] = useState(false)
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    void (async () => {
      setAssetLoaded(false)

      await Assets.loadBundle([
        'sounds',
        'sprites.town',
        'sprites.actors'
      ])

      setAssetLoaded(true)
    })()
  }, [])

  useLoadTexts(setTextLoaded)

  const loading = !textLoaded || !assetsLoaded

  if (loading) {
    return (
      <LoadingPage>
        <span ref={pctRef}></span>
      </LoadingPage>
    )
  }

  return (
    <>
     {children}
    </>
  )
}

export default AssetLoader
