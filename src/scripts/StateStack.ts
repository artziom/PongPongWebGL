import {States} from "./StatesIdentifiers";
import {State} from "./State";

export class StateStack {
    private readonly context: State.Context;
    private readonly states: Array<State.IState>;
    private readonly stateFactories: Map<States.ID, () => State.IState>;

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

    public registerState(stateID: States.ID, state: State.StateConstructor) {
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