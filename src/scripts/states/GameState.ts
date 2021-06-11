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
        this.ball.setMove("left", true);
        this.ball.setMove("down", true);
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
            for (const secondEntity of this.entities) {
                if (entity.getName() === secondEntity.getName()) {
                    continue;
                }

                if (this.collisionTest(entity, secondEntity)) {
                    switch (entity.getName()) {
                        case "Ball":
                            this.bounceBall(entity, secondEntity);
                            break;
                        case "Player Racket":
                            this.stopRacket(entity);
                            break;
                    }
                }

            }
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

    private bounceBall(ball: Entity, secondEntity: Entity) {
        const move = ball.getMove();
        const moveUp = move.up;
        const moveDown = move.down;
        const moveLeft = move.left;
        const moveRight = move.right;

        const name = secondEntity.getName();

        if (["Wall Top", "Wall Bottom"].includes(name)) {
            ball.setMove("up", moveDown);
            ball.setMove("down", moveUp);
        } else if (["Wall Left", "Wall Right", "Player Racket", "Enemy Racket"].includes(name)) {
            ball.setMove("left", moveRight);
            ball.setMove("right", moveLeft);
        }
    }

    private stopRacket(entity: Entity) {
        if (entity.getMove().up) {
            entity.setPosition(entity.getPosition().x, entity.getPosition().y + entity.getSpeed());
        } else {
            entity.setPosition(entity.getPosition().x, entity.getPosition().y - entity.getSpeed());
        }
        entity.setMove("up", false);
        entity.setMove("down", false);
    }

    private collisionTest(a: Entity, b: Entity): boolean {
        let aX1 = a.getBounds().x;
        let aX2 = a.getBounds().x + a.getBounds().width;
        let bX1 = b.getBounds().x;
        let bX2 = b.getBounds().x + b.getBounds().width;

        if (aX1 < bX2 && aX2 > bX1) {
            let aY1 = a.getBounds().y;
            let aY2 = a.getBounds().y + a.getBounds().height;
            let bY1 = b.getBounds().y;
            let bY2 = b.getBounds().y + b.getBounds().height;

            if (aY1 < bY2 && aY2 > bY1) {
                return true;
            }
        }

        return false;
    }
}