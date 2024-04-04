import LoadingPage from 'components/ui/loading/LoadingPage'
import * as TextManager from 'global/TextManager'
import { manifest } from 'bundles/manifest'
import { Assets } from 'pixi.js'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'

type Props = PropsWithChildren<unknown>

void Assets.init({ manifest })

const AssetLoader = (props: Props) => {
  const { children } = props
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState<string>('')
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    void (async () => {
      setText(TextManager.get('ui-game-loading-sprites'))

      await Assets.loadBundle([
        'sounds',
        'sprites.town',
        'sprites.actors'
      ])

      setLoading(false)
      setText(TextManager.get('ui-game-loading-sounds'))
    })()
  }, [])

  if (loading) {
    return (
      <LoadingPage>
        {text} <span ref={pctRef}></span>...
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
