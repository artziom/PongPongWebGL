import * as PIXI from "pixi.js";
import Queue from "tiny-queue";

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
        private states: Queue<State.IState>;
        private statesFactories: Map<string, (state: StateConstructor) => IState>;
        private state: State.IState;

        constructor(context: State.Context) {
            this.context = context;
        }

        public push(stateId: string){
            if(this.statesFactories.get(stateId) !== undefined){
                this.state = this.statesFactories.get(stateId)();
            }

        }

        public registerState(stateId: string, state: StateConstructor) {
            this.statesFactories.set(stateId, (state) => {
                return State.createState(state, this.context);
            });
        }

        public update(delta: number) {
            this.state.update(delta);
        }
    }
}