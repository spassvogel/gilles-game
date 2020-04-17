import { PixiComponent, Sprite, applyDefaultProps } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

interface Props  {
  tileWidth: number;
  tileHeight: number;
  tilePosition?: PIXI.Point;
};

type AllProps = Props & React.ComponentProps<typeof Sprite>;

const Actor = PixiComponent<AllProps, PIXI.Sprite>("Actor", {
  create() {
    const sprite = new PIXI.Sprite();
    return sprite;
  },
  applyProps(instance, oldProps: AllProps, newProps: AllProps) {
    const { image, texture, tilePosition, ...rest } = newProps;

    applyDefaultProps(instance, oldProps, rest);

    if ((texture && oldProps.texture !== newProps.texture) || (image && oldProps.image !== newProps.image)) {
      const texture = newProps.texture || PIXI.Texture.from(image!);
      instance.texture = texture; //getTextureFromProps(newProps)
    }

    if (tilePosition && pointsDiffer(oldProps.tilePosition, tilePosition)){
      instance.x = tilePosition.x * newProps.tileWidth;
      instance.y = tilePosition.y * newProps.tileHeight;
    }
}});
export default Actor;

// Returns true when 
const pointsDiffer = (point1?: PIXI.Point, point2?: PIXI.Point) => {
  console.log(point1, point2)
  if (!point1 || !point2) return true;
  return !point1.equals(point2);
}

// const getTextureFromProps = (props: AllProps) => {
//   const check = (inType: string, validator: { typeofs: string[], instanceofs: object[] }) => {
//     if (props.hasOwnProperty(inType)) {
//       const valid =
//         validator.typeofs.some(t => typeof props[inType] === t) ||
//         validator.instanceofs.some(i => props[inType] instanceof i)
//       return props[inType]
//     }
//   }

//   if (props.texture) {
//     return props.texture;
//   } else {
//     const result =
//       check('image', { typeofs: ['string'], instanceofs: [HTMLImageElement] }) ||
//       check('video', { typeofs: ['string'], instanceofs: [HTMLVideoElement] }) ||
//       check('source', {
//         typeofs: ['string', 'number'],
//         instanceofs: [HTMLImageElement, HTMLVideoElement, HTMLCanvasElement, PIXI.Texture],
//       })

//     return PIXI.Texture.from(result);
//   }
// }

