import * as PIXI from "pixi.js";
import Queue from 'tiny-queue';

const app = new PIXI.Application({
    antialias: true
});

document.body.appendChild(app.view);

const leftRacket = new PIXI.Graphics();
leftRacket.beginFill(0xFFFFFF);
leftRacket.drawRect(0, 0, 10, 75);
leftRacket.endFill();

leftRacket.x = 30;
leftRacket.y = 100;
// @ts-ignore
leftRacket.velocityUp = 0;
// @ts-ignore
leftRacket.velocityDown = 0;

app.stage.addChild(leftRacket);

const rightRacket = new PIXI.Graphics();
rightRacket.beginFill(0xFFFFFF);
rightRacket.drawRect(0, 0, 10, 75);
rightRacket.endFill();

rightRacket.x = app.view.width - 30 - rightRacket.width;
rightRacket.y = 500;
// @ts-ignore
rightRacket.velocityUp = 0;
// @ts-ignore
rightRacket.velocityDown = 0;

app.stage.addChild(rightRacket);

let topBottomWallColor = 0x00FF00;
let leftRightWallColor = 0xFF0000;

let wallTop = new PIXI.Graphics();
wallTop.beginFill(topBottomWallColor);
wallTop.drawRect(0, 0, app.view.width, 5);
wallTop.endFill();
wallTop.position.set(0, -wallTop.height);
app.stage.addChild(wallTop);

let wallRight = new PIXI.Graphics();
wallRight.beginFill(leftRightWallColor);
wallRight.drawRect(0, 0, 5, app.view.height);
wallRight.endFill();
wallRight.position.set(app.view.width, 0);
app.stage.addChild(wallRight);

let wallBottom = new PIXI.Graphics();
wallBottom.beginFill(topBottomWallColor);
wallBottom.drawRect(0, 0, app.view.width, 5);
wallBottom.endFill();
wallBottom.position.set(0, app.view.height);
app.stage.addChild(wallBottom);

let wallLeft = new PIXI.Graphics();
wallLeft.beginFill(leftRightWallColor);
wallLeft.drawRect(0, 0, -wallLeft.width, app.view.height);
wallLeft.endFill();
wallLeft.position.set(0, 0);
app.stage.addChild(wallLeft);

let ball = new PIXI.Graphics();
ball.beginFill(0xFFFFFF);
ball.drawRect(0, 0, 10, 10);
ball.endFill();
ball.position.set(app.view.width / 2 - ball.width / 2, app.view.height / 2 - ball.height / 2);
// @ts-ignore
ball.velocityX = 5;
// @ts-ignore
ball.velocityY = 5;
app.stage.addChild(ball);

app.ticker.add(delta => run(delta));

let textStyle = new PIXI.TextStyle();
textStyle.fill = 0xFFFFFF;
let collisionChecker = new PIXI.Text("", textStyle);
collisionChecker.anchor.set(0.5);
collisionChecker.position.set(app.view.width / 2, 20);
app.stage.addChild(collisionChecker);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let queue: Queue<(() => void)> = new Queue();

function run(delta: number) {
    let command: (() => void) | undefined = undefined;
    while ((command = queue.shift())) {
        command();
    }

    let leftRacketAfterMove = {
        x: leftRacket.x,
        y: leftRacket.y,
        width: leftRacket.width,
        height: leftRacket.height
    }
    // @ts-ignore
    leftRacketAfterMove.y -= leftRacket.velocityUp;
    // @ts-ignore
    leftRacketAfterMove.y += leftRacket.velocityDown;

    if (collisionTest(leftRacketAfterMove, wallTop) || collisionTest(leftRacketAfterMove, wallBottom)) {
        // @ts-ignore
        leftRacket.velocityUp = 0;
        // @ts-ignore
        leftRacket.velocityDown = 0;
    }

    // @ts-ignore
    leftRacket.y -= leftRacket.velocityUp;
    // @ts-ignore
    leftRacket.y += leftRacket.velocityDown;

    followBall(ball);

    // @ts-ignore
    rightRacket.y -= rightRacket.velocityUp;
    // @ts-ignore
    rightRacket.y += rightRacket.velocityDown;

    let ballAfterMove = {
        // @ts-ignore
        x: ball.x + ball.velocityX,
        // @ts-ignore
        y: ball.y + ball.velocityY,
        width: ball.width,
        height: ball.height
    }
    if (collisionTest(ballAfterMove, wallTop) || collisionTest(ballAfterMove, wallBottom)) {
        // @ts-ignore
        ball.velocityY *= -1;
    }

    if (collisionTest(ballAfterMove, leftRacket) || collisionTest(ballAfterMove, rightRacket)) {
        // @ts-ignore
        ball.velocityX *= -1;
    }

    if (collisionTest(ballAfterMove, wallLeft) || collisionTest(ballAfterMove, wallRight)) {
        // @ts-ignore
        ball.velocityX = 0;
        // @ts-ignore
        ball.velocityY = 0;
        collisionChecker.text = "Game Over!"
    }

    // @ts-ignore
    ball.x += ball.velocityX;
    // @ts-ignore
    ball.y += ball.velocityY;
}

function keyDownHandler(e: KeyboardEvent) {
    if ("code" in e) {
        switch (e.code) {
            case "ArrowUp":
                queue.push(() => setBoxUpVelocity(5));
                return;
            case "ArrowDown":
                queue.push(() => setBoxDownVelocity(5));
                return;
            default:
                return;
        }
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if ("code" in e) {
        switch (e.code) {
            case "ArrowUp":
                queue.push(() => setBoxUpVelocity(0));
                return;
            case "ArrowDown":
                queue.push(() => setBoxDownVelocity(0));
                return;
            default:
                return;
        }
    }
}

function setBoxUpVelocity(v: number) {
    // @ts-ignore
    leftRacket.velocityUp = v;
}

function setBoxDownVelocity(v: number) {
    // @ts-ignore
    leftRacket.velocityDown = v;
}

type rect = { x: number, y: number, width: number, height: number };

function followBall(ball : rect){

    if(ball.y > rightRacket.y){
        console.log(ball.y, rightRacket.y);
        // @ts-ignore
        rightRacket.velocityDown = 5;
        // @ts-ignore
        rightRacket.velocityUp = 0;
    }else if(ball.y < rightRacket.y){
        // @ts-ignore
        rightRacket.velocityDown = 0;
        // @ts-ignore
        rightRacket.velocityUp = 5;
    }
}

function collisionTest(a: rect, b: rect): boolean {
    let aX1 = a.x;
    let aX2 = a.x + a.width;
    let bX1 = b.x;
    let bX2 = b.x + b.width;

    if (aX1 < bX2 && aX2 > bX1) {
        let aY1 = a.y;
        let aY2 = a.y + a.height;
        let bY1 = b.y;
        let bY2 = b.y + b.height;

        if (aY1 < bY2 && aY2 > bY1) {
            return true;
        }
    }

    return false;
}