import React from "react";
import { Viewport as PixiViewport, ClickEventData } from "pixi-viewport";
import { PixiComponent } from "@inlet/react-pixi";
import { useApp } from '@inlet/react-pixi'

interface Props {
  children: React.ReactNode;
  onMount?(viewport: PixiViewport): void;
  onClick?(event: ClickEventData): void;
  screenWidth: number,
  screenHeight: number,
  worldWidth: number,
  worldHeight: number,
}

/** Viewport leverates pixi-viewport to create a pannable map */
const Viewport = (props: Props) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;  
};

interface PixiComponentProps {
    app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentProps & Props) => {
    const viewport = new PixiViewport({
      screenWidth: props.screenWidth,
      screenHeight: props.screenHeight,
      worldWidth: props.worldWidth,
      worldHeight: props.worldHeight,
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });
    viewport.on("clicked", (event) => { if(props.onClick) props.onClick(event) });
    //viewport.on("drag-start", () => console.log("drag-start"));
    //viewport.on("drag-end", () => console.log("drag-end"));

    viewport
      .drag()
      .pinch()
      .wheel()
      .clamp({ direction: 'all' })
      .clampZoom({ minScale: 0.75, maxScale: 2 })
      .decelerate();

    if(props.onMount) props.onMount(viewport);

    return viewport;
  },
  // applyProps: (instance, oldProps, newProps) => {
  //   console.log("applyProps");
  // },
  // didMount: () => {
  //   console.log("didMount");
  // },
  // willUnmount: () => {
  //   console.log("willUnmount");
  // }
});
export default Viewport;
