import { useSettings } from 'hooks/store/settings'
import { Assets } from 'pixi.js'
import { useEffect } from 'react'
import { defineAssetPath } from 'utils/assets'
import * as TextManager from 'global/TextManager'
import { languages } from 'constants/languages'

export const useLoadTexts = (onComplete: (v: boolean) => void) => {
  const { language } = useSettings() ?? languages[0]

  useEffect(() => {
    void (async () => {
      onComplete(false)
      const texts = await Assets.load<Record<string, string>>(defineAssetPath(`lang/${language}.common.json`))
      TextManager.init(texts)
      onComplete(true)
    })()
  }, [language, onComplete])
}
