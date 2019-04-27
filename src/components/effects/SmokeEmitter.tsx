
import Konva from "konva";
import * as React from "react";
import { FastLayer } from "react-konva";

interface Props {
    emitterX: number;
    emitterY: number;
    smokeImg: HTMLImageElement;
}

class SmokeEmitter extends React.Component<Props> {
    private layer: Konva.FastLayer | any;
    private animationFrame: number;

    public componentDidMount() {
        this.initSmoke();
        // this.startSmoke(); // auto starts
    }

    public componentWillUnmount() {
        this.stopSmoke();
    }

    public render() {
        return (
            <FastLayer
                ref = { (node) => this.layer = node! }
            >
            </FastLayer>
        );
    }

    protected initSmoke() {
        const context = this.layer.getContext();
        const canvas = this.layer.canvas;

        const particles: Particle[] = [];

        const minSpawnTime = 40;
        let lastEmission = performance.now();
        const maxLifeTime = 3000;

        const { emitterX, emitterY, smokeImg } = this.props;
        const spawnParticle = () =>  {
            if (performance.now() > lastEmission + minSpawnTime) {
                lastEmission = performance.now();
                particles.push(new Particle(emitterX, emitterY, maxLifeTime));
            }
        };

        const render = () => {
            let len = particles.length;
            context.clearRect(0, 0, canvas.width, canvas.height);
            while (len--) {
                if (particles[len].position.y < 0 || particles[len].lifeTime > maxLifeTime) {
                    particles.splice(len, 1);
                } else {
                    particles[len].update();

                    context.save();
                    const offsetX = -particles[len].size / 2;
                    const offsetY = -particles[len].size / 2;

                    context.translate(particles[len].position.x, particles[len].position.y);
                    context.rotate(particles[len].angle / 180 * Math.PI);
                    context.globalAlpha = particles[len].alpha;
                    context.drawImage(smokeImg, offsetX, offsetY, particles[len].size, particles[len].size);
                    context.restore();
                }
            }
            spawnParticle();
            this.animationFrame = requestAnimationFrame(render);
        };
        render();
    }

    protected stopSmoke() {
        cancelAnimationFrame(this.animationFrame);
    }
}

export default SmokeEmitter;

interface Vector2 {
    x: number;
    y: number;
}

// TODO: put all these parameters in Props
// TODO: see https://jsfiddle.net/DaanDeSmedt/Lyhcdmjh/ for more inspiration
class Particle {
    public position: Vector2;
    public size: number;
    public angle: number;
    public alpha: number;
    public lifeTime: number;

    private maxLifeTime: number;
    private startSize: number;
    private endSize: number;
    private startLife: number;
    private velocity: Vector2;

    constructor(x: number, y: number, maxLifeTime: number) {
        this.position = { x, y };
        this.maxLifeTime = maxLifeTime;

        this.size = 1;              // todo: props
        this.startSize = 32;    // todo: props
        this.endSize = 40;     // todo: props

        this.angle = Math.random() * 359;       // todo: props

        this.startLife = performance.now();
        this.lifeTime = 0;

        this.velocity = {
            x: 0,                                   // todo: props
            y: -3 - (Math.random() * 0.5),    // todo: props
        };
    }

    public update() {
        this.lifeTime = performance.now() - this.startLife;
        this.angle += 0.2;

        const lifePerc = ((this.lifeTime / this.maxLifeTime) * 100);

        this.size = this.startSize + ((this.endSize - this.startSize) * lifePerc * .1); // todo: huh?

        this.alpha = 1 - (lifePerc * .01);
        this.alpha = Math.max(this.alpha, 0);

        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y,
        };
    }
}
