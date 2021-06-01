import * as PIXI from "pixi.js";
import {States} from "./StatesIdentifiers";

export namespace State {
    export abstract class IState {
        private readonly stateStage: PIXI.Container;
        private readonly context: State.Context;
        private readonly stack: StateStack;

        protected constructor(stack: State.StateStack, context: State.Context) {
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
    }

    interface StateConstructor {
        new(stack: StateStack, context: State.Context): IState;
    }

    export function createState(state: StateConstructor, stack: StateStack, context: State.Context): IState {
        return new state(stack, context);
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
        private readonly stateFactories: Map<States.ID, () => IState>;

        constructor(context: State.Context) {
            this.context = context;
            this.states = new Array<State.IState>();
            this.stateFactories = new Map<States.ID, () => State.IState>();
        }

        public push(stateID: States.ID) {
            const stateConstructor = this.stateFactories.get(stateID);
            if (stateConstructor !== undefined) {
                this.states.push(stateConstructor());
            }
        }

        public pop() {
            this.states.pop();
        }

        public isEmpty() {
            return this.states.length === 0;
        }

        public registerState(stateID: States.ID, state: StateConstructor) {
            this.stateFactories.set(stateID, () => {
                return State.createState(state, this, this.context);
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