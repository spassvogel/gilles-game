import { UnresolvedAsset, type AssetsManifest } from 'pixi.js'
import { sprites } from './sprites'
import { entries } from 'utils/typescript'
import { defineAssetPath } from 'utils/assets'
import { sounds } from './sounds'

const addAssetsPath = (assets: Record<string, string>): UnresolvedAsset[] => {
  return entries(assets).map(([k, v]) => ({
    alias: k, // alias isn't used at this point
    src: defineAssetPath(v)
  }))
}

const flattenAndAddAssetsPath = (assets: Record<string, string | string[]>) => {
  return entries(assets).reduce<UnresolvedAsset>((acc, [k, v]) => {
    if (Array.isArray(v)) {
      acc.push(...(v.map((variation, i) => ({
        alias: `${variation}-${i}`,
        src: defineAssetPath(variation)
      }))))
    } else {
      acc.push({
        alias: k,
        src: defineAssetPath(v)
      })
    }
    return acc
  }, [])
}

export const manifest: AssetsManifest = {
  bundles: [{
    name: 'sounds',
    assets: flattenAndAddAssetsPath(sounds)
  }, {
    name: 'sprites.town',
    assets: addAssetsPath(sprites.town)
  }, {
    name: 'sprites.actors',
    assets: addAssetsPath(sprites.actors)
  }]
}
