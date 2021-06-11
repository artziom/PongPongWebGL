import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {Event} from "../Event";
import {Entity} from "../Entity";

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