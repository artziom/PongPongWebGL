import * as PIXI from "pixi.js";

const app = new PIXI.Application();

document.body.appendChild(app.view);

const box = new PIXI.Graphics();
box.lineStyle(2, 0xFFFFFF);
box.beginFill(0x00aa33);
box.drawRect(0, 0, 50, 50);
box.endFill();

box.x = app.view.width / 2;
box.y = app.view.height / 2;
// @ts-ignore
box.velocityUp = 0;
// @ts-ignore
box.velocityDown = 0;
// @ts-ignore
box.velocityLeft = 0;
// @ts-ignore
box.velocityRight = 0;
box.pivot.set(box.width / 2);

app.stage.addChild(box);

app.ticker.add(delta => run(delta));

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let commands: (() => void)[] = [];

function run(delta: number) {
    console.log();
    let command: (() => void) | undefined = undefined;
    while ((command = commands.pop())) {
        command();
    }

    // @ts-ignore
    box.y -= box.velocityUp;
    // @ts-ignore
    box.y += box.velocityDown;
    // @ts-ignore
    box.x -= box.velocityLeft;
    // @ts-ignore
    box.x += box.velocityRight;

    box.rotation += 0.01 * delta;
}

function keyDownHandler(e: KeyboardEvent) {
    if ("code" in e) {
        switch (e.code) {
            case "ArrowUp":
                commands.push(() => setBoxUpVelocity(1));
                return;
            case "ArrowDown":
                commands.push(() => setBoxDownVelocity(1));
                return;
            case "ArrowLeft":
                commands.push(() => setBoxLeftVelocity(1));
                return;
            case "ArrowRight":
                commands.push(() => setBoxRightVelocity(1));
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
                commands.push(() => setBoxUpVelocity(0));
                return;
            case "ArrowDown":
                commands.push(() => setBoxDownVelocity(0));
                return;
            case "ArrowLeft":
                commands.push(() => setBoxLeftVelocity(0));
                return;
            case "ArrowRight":
                commands.push(() => setBoxRightVelocity(0));
                return;
            default:
                return;
        }
    }
}


function setBoxUpVelocity(v: number) {
    // @ts-ignore
    box.velocityUp = v;
    console.log("UP", v);
}

function setBoxDownVelocity(v: number) {
    // @ts-ignore
    box.velocityDown = v;
    console.log("DOWN", v);
}

function setBoxLeftVelocity(v: number) {
    // @ts-ignore
    box.velocityLeft = v;
    console.log("LEFT", v);
}

function setBoxRightVelocity(v: number) {
    // @ts-ignore
    box.velocityRight = v;
    console.log("RIGHT", v);
}
