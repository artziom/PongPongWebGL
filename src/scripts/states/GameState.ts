import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {Event} from "../Event";
import {Entity} from "../Entity";
import {Vector2D} from "../utils/Vector2D";

export class GameState extends State.AbstractState {
    private readonly entities: Array<Entity>;
    private readonly playerRacket: Entity;
    private readonly ball: Entity;
    private readonly enemyRacket: Entity;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);
        this.entities = new Array<Entity>();

        const racketSize = new Vector2D(10, 75);

        this.playerRacket = new Entity("Player Racket", 10, new Vector2D(30, this.getApp().view.height / 2 - racketSize.y / 2), racketSize);
        this.entities.push(this.playerRacket);

        this.enemyRacket = new Entity("Enemy Racket", 10, new Vector2D(this.getApp().view.width - 30 - racketSize.x, this.getApp().view.height / 2 - racketSize.y / 2), racketSize);
        this.entities.push(this.enemyRacket)

        const ballSize = new Vector2D(10, 10);
        this.ball = new Entity("Ball", 10, new Vector2D(this.getApp().view.width / 2 - ballSize.x / 2, this.getApp().view.height / 2 - ballSize.y / 2), new Vector2D(10, 10));
        this.entities.push(this.ball);

        const wallThick = 5;
        this.entities.push(new Entity("Wall Top", 0, new Vector2D(0, -wallThick), new Vector2D(this.getApp().view.width, wallThick)));
        this.entities.push(new Entity("Wall Right", 0, new Vector2D(this.getApp().view.width, 0), new Vector2D(wallThick, this.getApp().view.height)));
        this.entities.push(new Entity("Wall Bottom", 0, new Vector2D(0, this.getApp().view.height), new Vector2D(this.getApp().view.width, wallThick)));
        this.entities.push(new Entity("Wall Left", 0, new Vector2D(-wallThick, 0), new Vector2D(wallThick, this.getApp().view.height)));

        for (const entity of this.entities) {
            this.addChildToStage(entity.getContainer());
        }
    }

    public update(delta: number): boolean {
        for (const entity of this.entities) {
            entity.update();
        }

        return true;
    }

    public handleEvent(eventKey: Event.Key): boolean {
        if (eventKey.type == Event.Type.KeyPressed) {
            if (eventKey.code == "KeyW") {
                this.playerRacket.setMove("up", true);
            }

            if (eventKey.code == "KeyS") {
                this.playerRacket.setMove("down", true);
            }
        }

        if (eventKey.type == Event.Type.KeyReleased) {
            if (eventKey.code == "KeyW") {
                this.playerRacket.setMove("up", false);
            }

            if (eventKey.code == "KeyS") {
                this.playerRacket.setMove("down", false);
            }
        }

        return true;
    }
}