import * as PIXI from "pixi.js";

const app = new PIXI.Application();

document.body.appendChild(app.view);

const box = new PIXI.Graphics();

box.lineStyle(2,0xFFFFFF);
box.beginFill(0x00aa33);
box.drawRect(0, 0,50,50);
box.endFill();
box.x = app.view.width / 2 - 25;
box.y = app.view.height / 2 - 25;
box.pivot.set(0.5);
app.stage.addChild(box);


app.ticker.add(delta => run(delta));

function run(delta:number){
    // box.x += 1 * delta;
    box.rotation += 0.01 * delta;
}