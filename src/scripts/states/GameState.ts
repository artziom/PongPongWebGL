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

    private readonly speed: number;
    private velocity: Vector2D;

    private readonly isMoving: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }

    constructor(name: string, speed: number) {
        this.name = name;
        this.speed = speed;
        this.isMoving = {
            down: false,
            up: false,
            left: false,
            right: false
        };

        this.container = new PIXI.Container();

        const ball = new PIXI.Graphics();
        ball.beginFill(0xFFFFFF);
        ball.drawRect(0, 0, 10, 10);
        ball.endFill();
        this.container.position.set(50, 50);

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

    public setMove(direction: "up" | "down" | "left" | "right", isMoving: boolean) {
        this.isMoving[direction] = isMoving;
    }

    public update(): void {
        const velocity = new Vector2D(0, 0);
        if (this.isMoving.up) {
            velocity.y = -this.speed;
        }

        if (this.isMoving.down) {
            velocity.y = this.speed;
        }

        if (this.isMoving.left) {
            velocity.x = -this.speed;
        }

        if (this.isMoving.right) {
            velocity.x = this.speed;
        }

        this.setPosition(this.getPosition().x + velocity.x, this.getPosition().y + velocity.y);
    }
}

export class GameState extends State.AbstractState {
    private ball: Entity;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);

        this.ball = new Entity("Ball", 10);
        this.addChildToStage(this.ball.getContainer());
    }

    public update(delta: number): boolean {
        this.ball.update();

        return true;
    }

    public handleEvent(eventKey: Event.Key): boolean {
        if (eventKey.type == Event.Type.KeyPressed) {
            if (eventKey.code == "KeyW") {
                this.ball.setMove("up", true);
            }

            if (eventKey.code == "KeyS") {
                this.ball.setMove("down", true);
            }
        }

        if (eventKey.type == Event.Type.KeyReleased) {
            if (eventKey.code == "KeyW") {
                this.ball.setMove("up", false);
            }

            if (eventKey.code == "KeyS") {
                this.ball.setMove("down", false);
            }
        }

        return true;
    }
}