
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import State from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import { DIRECTION_ENUM } from "../enums/Enums";

const BASE_URL = 'ui/smoke/death'
export default class DeathSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        // 烟雾死亡的资源就是一种空图片
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}`))
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}`))
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}`))
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}`))
    }
}