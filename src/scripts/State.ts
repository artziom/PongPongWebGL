import * as PIXI from "pixi.js";

export namespace State {
    export interface IState {
        readonly context: State.Context;

        update: (delta: number) => void;
    }

    interface StateConstructor {
        new(state: State.Context): IState;
    }

    export function createState(state: StateConstructor, context: State.Context): IState {
        return new state(context);
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

    export class StateStack {
        private readonly context: State.Context;
        private state: State.IState;

        constructor(context: State.Context) {
            this.context = context;
        }

        public registerState(state: StateConstructor) {
            this.state = State.createState(state, this.context);
        }

        public update(delta: number) {
            this.state.update(delta);
        }
    }
}