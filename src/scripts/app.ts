import * as PIXI from "pixi.js";
import Queue from 'tiny-queue';

const app = new PIXI.Application({
    antialias: true
});

document.body.appendChild(app.view);

const leftRacket = new PIXI.Graphics();
leftRacket.beginFill(0xFFFFFF);
leftRacket.drawRect(0, 0, 40, 40);
leftRacket.endFill();

// leftRacket.pivot.set(0, leftRacket.height / 2);
leftRacket.x = 30;
leftRacket.y = 100;
// @ts-ignore
leftRacket.velocityUp = 0;
// @ts-ignore
leftRacket.velocityDown = 0;
// @ts-ignore
leftRacket.velocityLeft = 0;
// @ts-ignore
leftRacket.velocityRight = 0;

app.stage.addChild(leftRacket);

let box = new PIXI.Graphics();
box.beginFill(0xFF0000);
box.drawRect(0, 0, 20, 20);
box.endFill();
app.stage.addChild(box);
box.position.set(70, 100);

app.ticker.add(delta => run(delta));

let textStyle = new PIXI.TextStyle();
textStyle.fill = 0xFFFFFF;
let collisionChecker = new PIXI.Text("No collision", textStyle);
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

    // @ts-ignore
    leftRacketAfterMove.x -= leftRacket.velocityLeft;
    // @ts-ignore
    leftRacketAfterMove.x += leftRacket.velocityRight;

    if (collisionTest(leftRacketAfterMove, box)) {
        // @ts-ignore
        leftRacket.velocityUp = 0;
        // @ts-ignore
        leftRacket.velocityDown = 0;
        // @ts-ignore
        leftRacket.velocityLeft = 0;
        // @ts-ignore
        leftRacket.velocityRight = 0;
    }

    // @ts-ignore
    leftRacket.y -= leftRacket.velocityUp;
    // @ts-ignore
    leftRacket.y += leftRacket.velocityDown;

    // @ts-ignore
    leftRacket.x -= leftRacket.velocityLeft;
    // @ts-ignore
    leftRacket.x += leftRacket.velocityRight;
}

function keyDownHandler(e: KeyboardEvent) {
    if ("code" in e) {
        switch (e.code) {
            case "ArrowUp":
                queue.push(() => setBoxUpVelocity(1));
                return;
            case "ArrowDown":
                queue.push(() => setBoxDownVelocity(1));
                return;
            case "ArrowLeft":
                queue.push(() => setBoxLeftVelocity(1));
                return;
            case "ArrowRight":
                queue.push(() => setBoxRightVelocity(1));
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
            case "ArrowLeft":
                queue.push(() => setBoxLeftVelocity(0));
                return;
            case "ArrowRight":
                queue.push(() => setBoxRightVelocity(0));
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

function setBoxLeftVelocity(v: number) {
    // @ts-ignore
    leftRacket.velocityLeft = v;
}

function setBoxRightVelocity(v: number) {
    // @ts-ignore
    leftRacket.velocityRight = v;
}

type rect = { x: number, y: number, width: number, height: number };

function collisionTest(a: rect, b: rect): boolean {
    let aX1 = a.x;
    let aX2 = a.x + a.width;
    let bX1 = b.x;
    let bX2 = b.x + b.width;
    // if(aX2 >= bX1 && aX2 <= bX2 || aX1 >= bX1 && aX1 <= bX2){
    if (aX1 < bX2 && aX2 > bX1) {
        let aY1 = a.y;
        let aY2 = a.y + a.height;
        let bY1 = b.y;
        let bY2 = b.y + b.height;

        // if(aY2 >= bY1 && aY2 <= bY2 || aY1 >= bY1 && aY1 <= bY2){
        if (aY1 < bY2 && aY2 > bY1) {
            collisionChecker.text = "Collision detected!";
            return true;
        }
    }
    collisionChecker.text = "No collision!";
    return false;
}