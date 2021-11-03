import React, { forwardRef, PropsWithChildren } from "react";
import { Viewport as PixiViewport } from "pixi-viewport";
import { PixiComponent, useApp } from "@inlet/react-pixi";
import gauntlet from "components/App/styles/img/cursors/dwarven_gauntlet_extra_6.png";
import { InteractionEvent, Application, Ticker } from "pixi.js";

interface Props {
  onClick?(event: InteractionEvent): void;
  screenWidth: number,
  screenHeight: number,
  worldWidth: number,
  worldHeight: number,
  minScale?: number;
  maxScale?: number;
}

/** Viewport leverages pixi-viewport to create a pannable map
 * https://davidfig.github.io/pixi-viewport/jsdoc/
 */
const Viewport = forwardRef<PixiViewport, PropsWithChildren<Props>>((props, ref) => {
  const app = useApp();
  if (app) {
    // Perhaps this is better moved somewhere else
    const cursor = `url('${gauntlet}'), auto`;
    app.renderer.plugins.interaction.cursorStyles.pointer = cursor;
  }
  return <PixiComponentViewport app={app} {...props} ref={ref} />;
})
Viewport.displayName = 'DisplayName';

interface PixiComponentProps {
  app: Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentProps & Props) => {
    const viewport = new PixiViewport({
      screenWidth: props.screenWidth,
      screenHeight: props.screenHeight,
      worldWidth: props.worldWidth,
      worldHeight: props.worldHeight,
      ticker: Ticker.shared,
      interaction: props.app.renderer.plugins.interaction,
      // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });
    viewport.on("clicked", (event) => { if(props.onClick) props.onClick(event) });

    const {
      minScale = 1,
      maxScale = 2
    } = props;

    viewport
    .drag()
    .pinch()
    .wheel()
    .clamp({ direction: 'all' })
    .clampZoom({ minScale, maxScale })
    .decelerate();

    return viewport as unknown as PixiViewport;
  },
});
export default Viewport;
