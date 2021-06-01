import * as PIXI from "pixi.js";
import {StateStack} from "./StateStack";
import {States} from "./StatesIdentifiers";

export namespace State {
    export interface StateConstructor {
        new(stack: StateStack, context: State.Context): AbstractState;
    }

    export abstract class AbstractState {
        private readonly stateStage: PIXI.Container;
        private readonly context: State.Context;
        private readonly stack: StateStack;

        protected constructor(stack: StateStack, context: State.Context) {
            this.stack = stack;
            this.context = context;
            this.stateStage = new PIXI.Container();

            this.context.getStage().addChild(this.stateStage);
        }

        public abstract update(delta: number): boolean;

        protected getApp(): PIXI.Application {
            return this.context.getApp();
        }

        protected getStage(): PIXI.Container {
            return this.stateStage;
        }

        protected requestStackPush(stateID: States.ID) {
            this.stack.push(stateID);
        }

        protected requestStackPop() {
            this.stateStage.destroy();
            this.stack.pop();
        }

        public static createState(state: StateConstructor, stack: StateStack, context: State.Context): AbstractState {
            return new state(stack, context);
        }
    }

    export class Context {
        private readonly app: PIXI.Application;

        constructor(app: PIXI.Application) {
            this.app = app;
        }

        public getApp(): PIXI.Application {
            return this.app;
        }

        public getStage(): PIXI.Container {
            return this.app.stage;
        }
    }
}