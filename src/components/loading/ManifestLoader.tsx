import LoadingPage from 'components/ui/loading/LoadingPage'
import * as TextManager from 'global/TextManager'
import { sounds } from 'manifests/sounds'
import { Assets } from 'pixi.js'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'
import { defineAssetPath } from 'utils/assets'

type Props = PropsWithChildren<unknown>

const ManifestLoader = (props: Props) => {
  const { children } = props
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState<string>('')
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    // const allSprites = sObject.values(sprites)
    setText(TextManager.get('ui-game-loading-sprites'))
    // Loader.shared.onProgress.add(() => {
    //   if (pctRef.current != null) {
    //     pctRef.current.innerHTML = `${(Loader.shared.progress).toFixed(0)}%`
    //   }
    // })

    // loadResourcesAsync(allSprites).then(() => {
    // Flatten!
    const allSounds = Object.values(sounds).reduce<string[]>((acc, value) => {
      if (Array.isArray(value)) {
        acc.push(...(value.map(defineAssetPath)))
      } else {
        acc.push(defineAssetPath(value))
      }
      return acc
    }, [])

    void Assets.load(allSounds).catch((e) => {
      console.warn(e)
    }).then(() => {
      setLoading(false)
    })
    setText(TextManager.get('ui-game-loading-sounds'))

    // loadResourcesAsync(allSounds).then(() => {
    //   setLoading(false)
    // })
    // })
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

export default ManifestLoader
