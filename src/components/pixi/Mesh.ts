import { PixiComponent } from "@inlet/react-pixi";
import * as PIXI from 'pixi.js';

interface Props  {
    geometry: PIXI.Geometry;
    shader: PIXI.Shader | PIXI.MeshMaterial;
    state?: PIXI.State;
    drawMode?: number;
};

const Mesh = PixiComponent<Props, PIXI.Mesh>("Mesh", {
    create(props) {
      return new PIXI.Mesh(props.geometry, props.shader, props.state, props.drawMode);
    }
});

export default Mesh;