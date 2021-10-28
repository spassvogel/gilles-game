import React from "react";
import { Container, Graphics, Sprite, Text } from "@inlet/react-pixi"
import { Structure } from "definitions/structures";
import { useStructureState } from "hooks/store/structures";
import { StructureState } from "store/types/structure";
import { TextManager } from "global/TextManager";
import { TextMetrics, TextStyle } from "@pixi/text";
import { Texture } from "@pixi/core";
import { BlurFilter } from "@pixi/filter-blur";
import StructureIconSprite from "./StructureIconSprite";

interface Props {
  structure: Structure;
  x: number;
  y: number;
}

const style = new TextStyle({
  fontFamily : 'Gabriela',
  fontSize: 25,
  fill: 0xffffff,
  wordWrap: true,
  wordWrapWidth: 200,
  dropShadow: true,
  dropShadowAngle: 0.9,
  dropShadowBlur: 10,
  dropShadowDistance: 0
})

const blurSize = 32;
const blurFilter = new BlurFilter(blurSize, 6)
const borderWidth = 985; // width of original border image

const StructureLabel = (props: Props) => {
  const { x, y } = props;
  const structure = useStructureState(props.structure);
  // const mask = useRef<PIXI.Graphics>(null);
    if (structure.state !== StructureState.Built){
    return null
  }
  const structureName = TextManager.getStructureName(props.structure) ?? "";

  const metrics = TextMetrics.measureText(`  ${structureName}`, style)
  return (
    <Container
      x={x}
      y={y}
      name={props.structure}
    >
      <Graphics
        name="background"
        draw={graphics => {
            graphics.beginFill(0x0, 0.75)
            graphics.drawRect(10, 0, metrics.width + 20, 32);
            graphics.endFill();
        }}
        filters={[blurFilter]}
        // mask={mask.current}
      />
       <Sprite
          name="border-top"
          image={`${process.env.PUBLIC_URL}/img/town/structure-label/border-top.png`}
          scale={[(metrics.width + 30)/ borderWidth, 0.2]}
          y={2}
       />
       <Sprite
          name="border-bottom"
          image={`${process.env.PUBLIC_URL}/img/town/structure-label/border-top.png`}
          y={28}
          scale={[(metrics.width + 30)/ borderWidth, 0.2]}
       />
       <StructureIconSprite
          name="icon"
          structure={props.structure}
          y={-2}
          x={metrics.width + 12}
          scale={[0.015, 0.015]}
       />
      {/* <Graphics
        name="mask"
        ref={mask}
        draw={graphics => {
            graphics.beginFill(0xff0000)
            graphics.drawRect(-32, 6, metrics.width + 60, 32-6);
            graphics.endFill();
        }}
      /> */}
      <Text
        anchor={[0, 0]}
        text={`  ${structureName[0].toUpperCase() + structureName.slice(1)}  `}
        style={style}
      />
    </Container>
  )
}

export default StructureLabel;

// function gradient(from: string, to: string) {
//   const c = document.createElement("canvas");
//   const ctx = c.getContext("2d");
//   if (!ctx) throw Error();
//   const grd = ctx.createLinearGradient(0,0,100,100);
//   grd.addColorStop(0, from);
//   grd.addColorStop(1, to);
//   ctx.fillStyle = grd;
//   ctx.fillRect(0,0,100,100);
//   return Texture.from(c);
// }
