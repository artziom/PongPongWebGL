import * as PIXI from "pixi.js";
import {Vector2D} from "./utils/Vector2D";

export class Entity {
    private readonly container: PIXI.Container;
    private readonly name: string;
    private readonly speed: number;
    private readonly isMoving: {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }

    private readonly startPosition: Vector2D;

    constructor(name: string, speed: number, position: Vector2D, size: Vector2D) {
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
        ball.drawRect(0, 0, size.x, size.y);
        ball.endFill();
        this.container.position.set(position.x, position.y);
        this.startPosition = position;
        this.container.addChild(ball);
    }

    public getName():string{
        return this.name;
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

    public resetPosition(): void{
        this.setPosition(this.startPosition.x, this.startPosition.y);
    }

    public getMove(): {
        up: boolean;
        down: boolean;
        left: boolean;
        right: boolean;
    }{
        return this.isMoving;
    }

    public getNextBounds(): PIXI.Rectangle {
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

        const rect = new PIXI.Rectangle();



        rect.x = this.getPosition().x + velocity.x;
        rect.y = this.getPosition().y + velocity.y;
        rect.width = this.getBounds().width;
        rect.height = this.getBounds().height;

        return rect;
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

    public getBounds(){
        return this.container.getBounds();
    }
}