import { FSM_PARAMS_TYPE_ENUM } from "../script/enums/Enums";
import State from "./State";
import { StateMachine } from "./StateMachine";

const { ccclass, property } = cc._decorator;

export abstract class SubStateMachine {
    private _currentState: State = null // 当前State
    stateMachines: Map<string, State> = new Map() // 状态机列表

    constructor(public fsm: StateMachine) { }
    get currentState() {
        return this._currentState
    }
    set currentState(newState) {
        this._currentState = newState
        this.currentState.run()
    }
    abstract run(): void
}
