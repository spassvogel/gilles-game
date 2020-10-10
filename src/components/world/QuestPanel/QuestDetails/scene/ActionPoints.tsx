import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { Graphics, Text } from '@inlet/react-pixi';

// tslint:disable-next-line: no-empty-interface
interface Props {
    tileWidth: number;
    tileHeight: number;
}

export interface RefActionPoints {
    drawAp: (location: [number, number], ap: number) => void;
    clear: () => void;
    parent: PIXI.Container;
}
/**
 * @param props
 */
const ActionPoints = forwardRef((props: Props, ref: React.Ref<RefActionPoints>) => {
    const textRef = useRef<PIXI.Text>(null);
    const { tileWidth, tileHeight } = props;

    useImperativeHandle(ref, () => {
        return {
            drawAp: (location: [number, number], ap: number)=> {
                if(textRef.current) {
                    textRef.current.x = tileWidth * location[0] + tileWidth / 2;
                    textRef.current.y = tileHeight * location[1] + tileHeight / 2;
                    textRef.current.text = `${ap}`;
                    textRef.current.visible = true;

                }
            },
            clear: () => {
                if(textRef.current) {
                    textRef.current.visible = false;
                }
            },
            parent: textRef.current?.parent!
        }
    });

    return (
        <Text
            name="ActionPoints"
            ref={textRef}
            anchor={[0.5, 0.5]}
            style={
                {fontFamily : 'Gabriela', fontSize: 42, fill : 0xff1010, align : 'center'}
            }
        />
    )
});

export default ActionPoints;

