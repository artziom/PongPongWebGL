import * as PIXI from "pixi.js";
import {State} from "./State";
import {StateStack} from "./StateStack";
import {Event} from "../Event";
import {Entity} from "../Entity";
import {Vector2D} from "../utils/Vector2D";
import {States} from "./StatesIdentifiers";

export class GameState extends State.AbstractState {
    private readonly entities: Array<Entity>;
    private readonly playerRacket: Entity;
    private readonly ball: Entity;
    private readonly enemyRacket: Entity;
    private readonly scores: {
        player: number,
        enemy: number
    }

    private readonly scoreBoard: PIXI.Text;

    constructor(stack: StateStack, context: State.Context) {
        super(stack, context);
        this.entities = new Array<Entity>();
        this.scores = {player: 0, enemy: 0};

        const style = new PIXI.TextStyle({
            fill: 0xFFFFFF
        });
        this.scoreBoard = new PIXI.Text(``, style);
        this.scoreBoard.anchor.set(0.5);
        this.scoreBoard.position.set(this.getApp().view.width / 2, 20);
        this.addChildToStage(this.scoreBoard);

        const racketSize = new Vector2D(10, 60);
        this.playerRacket = new Entity("Player Racket", 5, new Vector2D(30, this.getApp().view.height / 2 - racketSize.y / 2), racketSize);
        this.entities.push(this.playerRacket);
        this.enemyRacket = new Entity("Enemy Racket", 5, new Vector2D(this.getApp().view.width - 30 - racketSize.x, this.getApp().view.height / 2 - racketSize.y / 2), racketSize);
        this.entities.push(this.enemyRacket)

        const ballSize = new Vector2D(10, 10);
        this.ball = new Entity("Ball", 5 * 1.3, new Vector2D(this.getApp().view.width / 2 - ballSize.x / 2, this.getApp().view.height / 2 - ballSize.y / 2), new Vector2D(10, 10));
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

                if (entity.getName() === "Enemy Racket" && secondEntity.getName() === "Ball") {
                    this.followBall(entity, secondEntity);
                }

                if (this.collisionTest(entity.getNextBounds(), secondEntity.getBounds())) {
                    switch (entity.getName()) {
                        case "Ball":
                            this.bounceBall(entity, secondEntity);
                            break;
                        case "Player Racket":
                        case "Enemy Racket":
                            this.stopRacket(entity, secondEntity);
                            break;
                    }
                }

            }
            entity.update();
        }

        this.checkScores();

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

    private followBall(entity: Entity, ball: Entity): void {
        if (!(ball.getMove().right)){
            entity.setMove("down", false);
            entity.setMove("up", false);
            return;
        }

        if (entity.getPosition().y > ball.getPosition().y) {
            entity.setMove("down", false);
            entity.setMove("up", true);
        } else {
            entity.setMove("down", true);
            entity.setMove("up", false);
        }
    }

    private checkScores(): void {
        this.scoreBoard.text = `${this.scores.player} : ${this.scores.enemy}`;

        if (this.scores.player + this.scores.enemy >= 5 && this.scores.player > this.scores.enemy) {
            this.requestStackPop();
            this.requestStackPush(States.ID.Win);
        } else if (this.scores.player + this.scores.enemy >= 5 && this.scores.player < this.scores.enemy) {
            this.requestStackPop();
            this.requestStackPush(States.ID.GameOver);
        }
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
        } else if (["Player Racket", "Enemy Racket", "Wall Left", "Wall Right"].includes(name)) {
            ball.setMove("left", moveRight);
            ball.setMove("right", moveLeft);
        }

        if ("Wall Left" === name) {
            this.scores.enemy++;
            this.ball.resetPosition();
        } else if ("Wall Right" === name) {
            this.scores.player++;
            this.ball.resetPosition();
        }
    }

    private stopRacket(entity: Entity, secondEntity: Entity) {
        if (secondEntity.getName() === "Ball") {
            return;
        }

        entity.setMove("up", false);
        entity.setMove("down", false);
    }

    private collisionTest(aBounds: PIXI.Rectangle, bBounds: PIXI.Rectangle): boolean {
        return aBounds.x < bBounds.x + bBounds.width
            && aBounds.x + aBounds.width > bBounds.x
            && aBounds.y < bBounds.y + bBounds.height
            && aBounds.y + aBounds.height > bBounds.y;
    }
}