import React, { ComponentProps, useRef } from "react";
import { Container, Graphics, Sprite, Text } from "@inlet/react-pixi"

import alchemist from "components/structures/styles/images/alchemist/icon.png"
import armoursmith from "components/structures/styles/images/armoursmith/icon.png"
import garden from "components/structures/styles/images/garden/icon.png"
import lumberMill from "components/structures/styles/images/lumberMill/icon.png"
import mine from "components/structures/styles/images/mine/icon.png"
import quarry from "components/structures/styles/images/quarry/icon.png"
import tannery from "components/structures/styles/images/tannery/icon.png"
import tavern from "components/structures/styles/images/tavern/icon.png"
import warehouse from "components/structures/styles/images/warehouse/icon.png"
import weaponsmith from "components/structures/styles/images/weaponsmith/icon.png"
import weaver from "components/structures/styles/images/weaver/icon.png"
import workshop from "components/structures/styles/images/workshop/icon.png"
import { Structure } from "definitions/structures";

interface Props {
  structure: Structure;
}

const StructureIconSprite = (props: Props & ComponentProps<typeof Sprite>) => (
  <Sprite
    image={getImage(props.structure)}
    {...props}
  />
)
export default StructureIconSprite;

const getImage = (structure: Structure) => {
  switch (structure) {
    case "alchemist": return alchemist;
    case "armoursmith": return armoursmith;
    case "garden": return garden;
    case "lumberMill": return lumberMill;
    case "mine": return mine;
    case "quarry": return quarry;
    case "tannery": return tannery;
    case "tavern": return tavern;
    case "warehouse": return warehouse;
    case "weaponsmith": return weaponsmith;
    case "weaver": return weaver;
    case "workshop": return workshop;
    default:
      throw new Error(`No such structure ${structure}`)
  }
}
