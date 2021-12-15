import EventEmitter from "events";
import { Point } from "pixi.js";
import TypedEmitter from "typed-emitter";


export const EVENT_BUBBLE_ADDED = "bubbleAdded";
export enum BubbleType { combat, resource }
export enum BubbleLayer { general, scene }

interface BubbleEvents {
  [EVENT_BUBBLE_ADDED]: (text: string, point: Point, bubbleType?: BubbleType, layer?: BubbleLayer) => void;
}

export class BubbleManager extends (EventEmitter as new () => TypedEmitter<BubbleEvents>) {
  private static _instance = new BubbleManager();

  static addBubble(text: string, point: Point, bubbleType: BubbleType = BubbleType.combat, layer: BubbleLayer = BubbleLayer.general) {
    this.instance.emit(EVENT_BUBBLE_ADDED, text, point, bubbleType, layer);
  }

  static get instance() {
    return this._instance;
  }
}
