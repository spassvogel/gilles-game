import React from "react";
import { Graphics } from '@inlet/react-pixi';

interface Props {
    positions: PIXI.Point[];
}

const QuestLine = (props: Props) => {
    const { positions } = props;
    if (props.positions.length > 2) {
        return <Graphics
            name="questline"
            x={0}
            y={0}
            draw={graphics => {
                graphics.lineStyle(3, 0xFF3300);
                graphics.moveTo(positions[0].x, positions[0].y);

                let i = 0;
                for (i = 1; i < positions.length - 2; i ++)
                {
                    var xc = (positions[i].x + positions[i + 1].x) / 2;
                    var yc = (positions[i].y + positions[i + 1].y) / 2;
                    graphics.quadraticCurveTo(positions[i].x, positions[i].y, xc, yc);
                }
                graphics.quadraticCurveTo(positions[i].x, positions[i].y, positions[i+1].x, positions[i+1].y);
                graphics.endFill(); 
            }}
        />;
    }
    return null;
}

export default QuestLine;
// tx.moveTo(positions[0].x, positions[0].y);


//    for (i = 1; i < positions.length - 2; i ++)
//    {
//       var xc = (positions[i].x + positions[i + 1].x) / 2;
//       var yc = (positions[i].y + positions[i + 1].y) / 2;
//       ctx.quadraticCurveTo(positions[i].x, positions[i].y, xc, yc);
//    }
//  // curve through the last two positions
//  ctx.quadraticCurveTo(positions[i].x, positions[i].y, positions[i+1].x,positions[i+1].y);