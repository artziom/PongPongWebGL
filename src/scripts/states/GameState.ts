import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {Event} from "../Event";

class Entity {
    private readonly container: PIXI.Container;
    private name: string;

    constructor(name: string) {
        this.name = name;
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

    public setPosition(x: number, y: number) {
        this.container.position.set(x, y);
    }

    public getPosition() {
        return this.container.position;
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
        return false;
    }

    public handleEvent(eventKey: Event.Key): boolean {

        if (eventKey.code == "KeyW" && eventKey.type == Event.Type.KeyPressed) {
            this.ball.setPosition(this.ball.getPosition().x, this.ball.getPosition().y - 10);
        }

        if (eventKey.code == "KeyS" && eventKey.type == Event.Type.KeyPressed) {
            this.ball.setPosition(this.ball.getPosition().x, this.ball.getPosition().y + 10);
        }

        if (eventKey.code == "KeyA" && eventKey.type == Event.Type.KeyPressed) {
            this.ball.setPosition(this.ball.getPosition().x - 10, this.ball.getPosition().y);
        }

        if (eventKey.code == "KeyD" && eventKey.type == Event.Type.KeyPressed) {
            this.ball.setPosition(this.ball.getPosition().x + 10, this.ball.getPosition().y);
        }
        return true;
    }
}