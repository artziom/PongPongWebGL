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

leftRacket.pivot.set(0, leftRacket.height / 2);
leftRacket.x = 10;
leftRacket.y = app.view.height / 2;
// @ts-ignore
leftRacket.velocityUp = 0;
// @ts-ignore
leftRacket.velocityDown = 0;

app.stage.addChild(leftRacket);
app.ticker.add(delta => run(delta));

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let queue: Queue<(() => void)> = new Queue();

function run(delta: number) {
    let command: (() => void) | undefined = undefined;
    while ((command = queue.shift())) {
        command();
    }

    // @ts-ignore
    leftRacket.y -= leftRacket.velocityUp;
    // @ts-ignore
    leftRacket.y += leftRacket.velocityDown;
}

function keyDownHandler(e: KeyboardEvent) {
    if ("code" in e) {
        switch (e.code) {
            case "ArrowUp":
                queue.push(() => setBoxUpVelocity(10));
                return;
            case "ArrowDown":
                queue.push(() => setBoxDownVelocity(10));
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