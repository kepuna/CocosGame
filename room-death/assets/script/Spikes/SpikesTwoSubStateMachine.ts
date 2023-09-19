
import State from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import { SPIKE_COUNT_ENUM } from "../enums/Enums";
import SpikesSubStateMachine from "./SpikesSubStateMachine";

const BASE_URL = 'ui/spikes/spikestwo'
export default class SpikesTwoSubStateMachine extends SpikesSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.stateMachines.set(SPIKE_COUNT_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`))
        this.stateMachines.set(SPIKE_COUNT_ENUM.ONE, new State(fsm, `${BASE_URL}/one`))
        this.stateMachines.set(SPIKE_COUNT_ENUM.TWO, new State(fsm, `${BASE_URL}/two`))
        this.stateMachines.set(SPIKE_COUNT_ENUM.THREE, new State(fsm, `${BASE_URL}/three`))
    }
}