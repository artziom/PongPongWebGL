import * as PIXI from "pixi.js";

const app = new PIXI.Application();

document.body.appendChild(app.view);

const box = new PIXI.Graphics();

box.lineStyle(2,0xFFFFFF);
box.beginFill(0x00aa33);
box.drawRect(app.view.width / 2 - 25, app.view.height / 2 - 25,50,50);
box.endFill();

app.stage.addChild(box);