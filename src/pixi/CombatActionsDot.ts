import { SceneActionType } from 'store/types/scene';

interface ActionTabConfig {
    action: SceneActionType,
    icon: string
}

class CombatActionDot extends PIXI.Container {
    tabContainer: PIXI.Container;
    ring: PIXI.Graphics = new PIXI.Graphics();
    ringDiameter: number;
    text: PIXI.Text;
    activeAction?: SceneActionType;

    constructor(tileWidth: number, tileHeight: number) {
        super();

        this.tabContainer = new PIXI.Container();
        this.addChild(this.tabContainer);
        this.ringDiameter = Math.sqrt(tileWidth * tileHeight) / 2; // diameter of the ring is twice as small as the tile
        this.drawRingNormal();
        
        //ring.anchor.set(0.5);
        this.interactive = true;
        this.ring.hitArea = new PIXI.Circle(0, 0, 25);
        this.on('pointerover', () => {
            this.drawRingHover();
        });
        this.on('pointerout', () => {
            this.drawRingNormal();
        });
        
        const highlight = new PIXI.Graphics();
        highlight.beginFill(0xffffff, 0.2);
        highlight.drawCircle(0, 0, 25);
        highlight.alpha = 0;
        this.addChild(this.ring);
        this.addChild(highlight);

        this.text = new PIXI.Text("", {fontFamily : 'Gabriela', fontSize: 22, fill : 0xffffff, align : 'center',     
            dropShadow: true,
            dropShadowAngle: 0.9,
            dropShadowBlur: 10,
            dropShadowDistance: 0
        });
        this.text.anchor.set(0.5);
        this.text.y = -40;
        this.addChild(this.text)
    }
    
    setActionTabs(tabs: ActionTabConfig[]) {
        // clear out existing tabs
        this.tabContainer.removeChildren();

        const rotations = [
            [0],
            [Math.PI / 2],
            [Math.PI / 4, 3 * Math.PI / 4],
            [Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4]
        ]
        tabs.forEach((val, index) => {
            
            const tab = PIXI.Sprite.from(`${process.env.PUBLIC_URL}/img/scene/ui/combat/tab.png`);
            tab.interactive = true;

            //  tab.y = 50;
            tab.anchor.set(-0.5, 0.5)
            this.tabContainer.addChild(tab);
            tab.rotation = rotations[tabs.length][index];
            
            const icon = PIXI.Sprite.from(`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/${val.icon}.svg`);
            icon.anchor.set(0.5);
            icon.x = 40;
            icon.width = icon.height = 28;
            icon.rotation = -rotations[tabs.length][index];
            tab.addChild(icon);

            tab.on("pointerover", () => {
                this.text.text = val.action;
                this.activeAction = val.action;
            })

            tab.on("pointerout", () => {
                this.text.text = "";
                this.activeAction = undefined;
            })
        })
        // const icon = PIXI.Sprite.from(`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/crosshair.svg`);
        
    }
    
    drawRingNormal() {
        this.ring.clear();
        this.ring.lineStyle(3, 0x00617d);
        this.ring.drawCircle(0, 0, this.ringDiameter / 2);
        this.ring.endFill();
        this.tabContainer.visible = false;
    }

    drawRingHover() {
        this.ring.clear();
        this.ring.lineStyle(5, 0x00617d);
        this.ring.drawCircle(0, 0, this.ringDiameter / 2);
        this.ring.endFill();
        this.tabContainer.visible = true;
    }

}

export default CombatActionDot;