import * as PIXI from "pixi.js";

export namespace State {
    export interface IState {
        readonly context: State.Context;

        update: (delta: number) => boolean;
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
        private readonly states: Array<State.IState>;
        private readonly stateFactories: Map<string, () => IState>;

        constructor(context: State.Context) {
            this.context = context;
            this.states = new Array<State.IState>();
            this.stateFactories = new Map<string, () => State.IState>();
        }

        public push(stateId: string) {
            const stateConstructor = this.stateFactories.get(stateId);
            if (stateConstructor !== undefined) {
                this.states.push(stateConstructor());
            }
        }

        public pop() {
            this.states.pop();
        }

        public registerState(stateId: string, state: StateConstructor) {
            this.stateFactories.set(stateId, () => {
                return State.createState(state, this.context);
            });
        }

        public update(delta: number) {
            // Iterate from first to last, stop as soon as update() returns false
            for (let state of this.states) {
                if (!state.update(delta)) {
                    break;
                }
            }
        }
    }
}