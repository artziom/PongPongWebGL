import {States} from "./StatesIdentifiers";
import {State} from "./State";
import {Event} from "../Event";

export class StateStack {
    private readonly context: State.Context;
    private readonly states: Array<State.AbstractState>;
    private readonly stateFactories: Map<States.ID, () => State.AbstractState>;

    constructor(context: State.Context) {
        this.context = context;
        this.states = new Array<State.AbstractState>();
        this.stateFactories = new Map<States.ID, () => State.AbstractState>();
    }

    public handleEvent(eventKey: Event.Key) {
        // Iterate from first to last, stop as soon as update() returns false
        for (let state of this.states) {
            if (!state.handleEvent(eventKey)) {
                break;
            }
        }
    }

    public update(delta: number) {
        // Iterate from first to last, stop as soon as update() returns false
        for (let state of this.states) {
            if (!state.update(delta)) {
                break;
            }
        }
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
            return State.AbstractState.createState(state, this, this.context);
        });
    }
}