import { useApp } from '@inlet/react-pixi'
import { useEffect, useRef } from 'react';

// Obsolete, using pixi-viewport now
const Controls = () => {
    const app = useApp();
    console.log(app);

    const prevPoint = useRef<PIXI.Point>();

    useEffect(() => {
        app.stage.interactive = true;
        app.stage.addListener('pointerdown', (event) => {
            prevPoint.current = event.data.global.clone();
        });

        app.stage.addListener('pointermove', (event) => {
            if (!prevPoint.current) {
                return;
            }
            var dx = event.data.global.x - prevPoint.current.x;
            var dy = event.data.global.y - prevPoint.current.y;

            const bounds = app.stage.getLocalBounds();
            
            app.stage.position.x += dx;
            if (app.stage.position.x > 0) {
                // Left edge
                app.stage.position.x = 0;
            } 
            else if (app.stage.position.x < (app.screen.width - bounds.width)) {
                // Right edge
                app.stage.position.x = (app.screen.height - bounds.width);
            }

            app.stage.position.y += dy;
            if (app.stage.position.y > 0) {
                // Top edge
                app.stage.position.y = 0;
            }
            else if (app.stage.position.y < (app.screen.height - bounds.height)) {
                // Bottom edge
                app.stage.position.y = (app.screen.height - bounds.height);
            }

            prevPoint.current = event.data.global.clone();
        });

        app.stage.addListener('pointerup', (event) => {
            prevPoint.current = undefined;
        })

        app.stage.addListener('pointerout', (event) => {
            prevPoint.current = undefined;
        })

    }, [app.screen, app.stage]);

    return null;
}

export default Controls;