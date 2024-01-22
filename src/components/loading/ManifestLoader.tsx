import LoadingPage from 'components/ui/loading/LoadingPage'
import * as TextManager from 'global/TextManager'
import { sprites } from 'manifests/sprites'
import { sounds } from 'manifests/sounds'
import { Assets, Loader } from 'pixi.js'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'

type Props = PropsWithChildren<unknown>

const ManifestLoader = (props: Props) => {
  const { children } = props
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState<string>('')
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const allSprites = Object.values(sprites)
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
        acc.push(...value)
      } else {
        acc.push(value)
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
