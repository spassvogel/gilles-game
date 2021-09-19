import React from "react";
import { Text } from "@inlet/react-pixi"
import { Structure } from "definitions/structures";
import { useStructureState } from "hooks/store/structures";
import { StructureState } from "store/types/structure";
import { TextManager } from "global/TextManager";

interface Props {
  structure: Structure;
  x: number;
  y: number;
}

const StructureLabel = (props: Props) => {
  const { x, y } = props;
  const structure = useStructureState(props.structure);
  if (structure.state !== StructureState.Built){
    return null
  }
  const structureName = TextManager.getStructureName(props.structure) ?? "";

  return (
    <Text
      x={x}
      y={y}
      anchor={[0, 1]}
      text={`  ${structureName[0].toUpperCase() + structureName.slice(1)}  `}
      style={{
        fontFamily : 'Gabriela',
        fontSize: 25,
        fill: 0xffffff,
        wordWrap: true,
        wordWrapWidth: 200,
        dropShadow: true,
        dropShadowAngle: 0.9,
        dropShadowBlur: 10,
        dropShadowDistance: 0
    }}
    />
  )
}

export default StructureLabel;
