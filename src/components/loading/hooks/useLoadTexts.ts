import { useSettings } from 'hooks/store/settings'
import { Assets } from 'pixi.js'
import { useEffect } from 'react'
import { defineAssetPath } from 'utils/assets'
import * as TextManager from 'global/TextManager'
import * as LoreTextManager from 'global/LoreTextManager'
import { type LoreTexts } from 'global/LoreTextManager'
import { languages } from 'constants/languages'

export const useLoadTexts = (onComplete: (v: boolean) => void) => {
  const { language = languages[0] } = useSettings()

  useEffect(() => {
    void (async () => {
      onComplete(false)
      const texts = await Assets.load<Record<string, string>>(defineAssetPath(`lang/${language}.common.json`))
      TextManager.init(texts)

      const loreTexts = await Assets.load<LoreTexts>(defineAssetPath(`lang/${language}.loretext.json`))
      LoreTextManager.init(loreTexts)
      onComplete(true)
    })()
  }, [language, onComplete])
}
