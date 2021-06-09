import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {Event} from "../Event";


class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Entity {
    private readonly container: PIXI.Container;
    private name: string;

    private velocity: Vector2D;

    constructor(name: string) {
        this.name = name;
        this.container = new PIXI.Container();

        const ball = new PIXI.Graphics();
        ball.beginFill(0xFFFFFF);
        ball.drawRect(0, 0, 10, 10);
        ball.endFill();
        this.container.position.set(50, 50);

        this.velocity = new Vector2D(0, 0);

        this.container.addChild(ball);
    }

    public getContainer(): PIXI.Container {
        return this.container;
    }

    public setPosition(x: number, y: number): void {
        this.container.position.set(x, y);
    }

    public getPosition() {
        return this.container.position;
    }

    public setVelocity(velocity: Vector2D): void {
        this.velocity = velocity;
    }

    public getVelocity(): Vector2D {
        return this.velocity;
    }

    public update(): void {
        this.setPosition(this.getPosition().x + this.getVelocity().x, this.getPosition().y + this.getVelocity().y);
    }

}

export class GameState extends State.AbstractState {
    private ball: Entity;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);

        this.ball = new Entity("Ball");
        this.addChildToStage(this.ball.getContainer());
    }

    public update(delta: number): boolean {
        this.ball.update();

        return true;
    }

    public handleEvent(eventKey: Event.Key): boolean {
        const speed = 10;

        if (eventKey.type == Event.Type.KeyPressed) {
            if (eventKey.code == "KeyW") {
                this.ball.setVelocity(new Vector2D(this.ball.getVelocity().x, -speed));
            }

            if (eventKey.code == "KeyS") {
                this.ball.setVelocity(new Vector2D(this.ball.getVelocity().x, speed));
            }

            if (eventKey.code == "KeyA") {
                this.ball.setVelocity(new Vector2D(-speed, this.ball.getVelocity().y));

            }

            if (eventKey.code == "KeyD") {
                this.ball.setVelocity(new Vector2D(speed, this.ball.getVelocity().y));

            }
        }


        if (eventKey.type == Event.Type.KeyReleased) {
            if (eventKey.code == "KeyW") {
                this.ball.setVelocity(new Vector2D(this.ball.getVelocity().x, 0));
            }

            if (eventKey.code == "KeyS") {
                this.ball.setVelocity(new Vector2D(this.ball.getVelocity().x, 0));
            }

            if (eventKey.code == "KeyA") {
                this.ball.setVelocity(new Vector2D(0, this.ball.getVelocity().y));

            }

            if (eventKey.code == "KeyD") {
                this.ball.setVelocity(new Vector2D(0, this.ball.getVelocity().y));

            }
        }

        return true;
    }
}