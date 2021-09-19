import React, { useEffect, useState } from "react";
import { Container } from "@inlet/react-pixi"
import FontFaceObserver from "fontfaceobserver";
import StructureLabel from "./StructureLabel";

const StructureLabels = () => {
  const [fontLoaded, setFontLoaded] = useState(false)
  useEffect(() => {
    const font = new FontFaceObserver('Gabriela');
    font.load().then(function () {
      setFontLoaded(true)
    });
  }, []);

  if (!fontLoaded) return null
  return (
    <Container>
      <StructureLabel structure={"tavern"} x={645} y={535} />
      <StructureLabel structure={"warehouse"} x={430} y={130} />
      <StructureLabel structure={"lumberMill"} x={235} y={410} />
      <StructureLabel structure={"alchemist"} x={375} y={460} />
      <StructureLabel structure={"weaponsmith"} x={435} y={495} />
      <StructureLabel structure={"armoursmith"} x={515} y={425} />
      <StructureLabel structure={"weaver"} x={555} y={370} />
      <StructureLabel structure={"tannery"} x={255} y={520} />
      <StructureLabel structure={"mine"} x={185} y={590} />
      <StructureLabel structure={"workshop"} x={345} y={660} />
      <StructureLabel structure={"quarry"} x={685} y={666} />
      <StructureLabel structure={"garden"} x={785} y={776} />
    </Container>
  )
}

export default StructureLabels;
