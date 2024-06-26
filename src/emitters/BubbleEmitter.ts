import EventEmitter from 'events'
import { type Point } from 'pixi.js'
import type TypedEmitter from 'typed-emitter'

export const EVENT_BUBBLE_ADDED = 'bubbleAdded'
export enum BubbleType {
  combat,
  crit,
  resource,
}
export enum BubbleLayer { general, scene }

type BubbleEvents = {
  [EVENT_BUBBLE_ADDED]: (text: string, point: Point, bubbleType?: BubbleType, layer?: BubbleLayer) => void
}

export class BubbleEmitter extends (EventEmitter as unknown as new () => TypedEmitter<BubbleEvents>) {
  private static readonly _instance = new BubbleEmitter()

  static addBubble (text: string, point: Point, bubbleType: BubbleType = BubbleType.combat, layer: BubbleLayer = BubbleLayer.general) {
    this.instance.emit(EVENT_BUBBLE_ADDED, text, point, bubbleType, layer)
  }

  static get instance () {
    return this._instance
  }
}
