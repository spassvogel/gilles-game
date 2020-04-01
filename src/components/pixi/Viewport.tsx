import React from "react";
import { Viewport as PixiViewport, ClickEventData } from "pixi-viewport";
import { PixiComponent, useApp } from "@inlet/react-pixi";

interface Props {
  children: React.ReactNode;
  onClick?(event: ClickEventData): void;
  screenWidth: number,
  screenHeight: number,
  worldWidth: number,
  worldHeight: number,
}

/** Viewport leverages pixi-viewport to create a pannable map 
 * https://davidfig.github.io/pixi-viewport/jsdoc/
 */
const Viewport = React.forwardRef<PixiViewport, any>((props, ref) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} ref={ref} />;  
})

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
