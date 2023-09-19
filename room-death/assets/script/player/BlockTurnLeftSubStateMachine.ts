/*
 * @Author       : jiajung
 * @Version      : V1.0
 * @Date         : 2023-09-01 15:12:36
 * @Description  : 
 */

import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import State from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import { DIRECTION_ENUM } from "../enums/Enums";

const BASE_URL = 'ui/player/blockturnleft'

export default class BlockTurnLeftSubStateMachine extends DirectionSubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.stateMachines.set(
            DIRECTION_ENUM.TOP,
            new State(fsm, `${BASE_URL}/top`, cc.WrapMode.Default)
        )

        this.stateMachines.set(
            DIRECTION_ENUM.BOTTOM,
            new State(fsm, `${BASE_URL}/bottom`, cc.WrapMode.Default)
        )

        this.stateMachines.set(
            DIRECTION_ENUM.LEFT,
            new State(fsm, `${BASE_URL}/left`, cc.WrapMode.Default)
        )

        this.stateMachines.set(
            DIRECTION_ENUM.RIGHT,
            new State(fsm, `${BASE_URL}/right`, cc.WrapMode.Default)
        )

    }
}